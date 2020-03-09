'use strict'

const awsSdk = require('aws-sdk')
const cryptoUtil = require('./cryptoUtil')
const deepEqual = require('deep-equal')
const recordUtil = require('./recordUtil')
const proto = require('./constants/proto')
const { limitConcurrency } = require('../lib/promiseHelper')
const s3Helper = require('../lib/s3Helper')
const serializer = require('../lib/serializer')
const LRUCache = require('lru-cache')

const CONFIG = require('./config')

const checkFetchStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const isExpiredCredentialError = (error) => {
  if (!error || !error.message) {
    return false
  }
  return CONFIG.EXPIRED_CREDENTIAL_ERRORS.some((message) => {
    return error.message.match(message)
  })
}

const createAndSubscribeSQSforCategory = function (deviceId, category, thisRef) {
  const newQueueParams = {
    QueueName: thisRef.sqsName(deviceId, category),
    Attributes: {
      MessageRetentionPeriod: s3Helper.SQS_RETENTION
    }
  }
  return new Promise((resolve, reject) => {
    thisRef.sqs.createQueue(newQueueParams, (error, data) => {
      if (error) {
        console.log('SQS creation failed with error: ' + error)
        reject(error)
      } else if (data) {
        thisRef.SQSUrlByCat[category] = data.QueueUrl
        resolve([])
      }
    })
  })
}

/**
 * @param {{
 *   apiVersion: <string>,
 *   credentialsBytes: <Uint8Array=>, // If missing, will be requested
 *   keys: {{ // User's encryption keys
 *     publicKey: <Uint8Array>, secretKey: <Uint8Array>,
 *     fingerprint: <string=>, secretboxKey: <Uint8Array>}},
 *   serializer: <Object>,
 *   serverUrl: <string>
 * }} opts
 */
const RequestUtil = function (opts = {}) {
  if (!opts.apiVersion) { throw new Error('Missing apiVersion.') }
  if (!opts.keys) { throw new Error('Missing keys.') }
  if (!opts.serializer) { throw new Error('Missing serializer.') }
  if (!opts.serverUrl) { throw new Error('Missing serverUrl.') }
  this.apiVersion = opts.apiVersion
  this.serializer = opts.serializer
  this.serverUrl = opts.serverUrl
  this.userId = Buffer.from(opts.keys.publicKey).toString('base64')
  // For SQS names, which don't allow + and /
  this.userIdBase62 = this.userId.replace(/[^A-Za-z0-9]/g, '')
  this.encrypt = cryptoUtil.Encrypt(this.serializer, opts.keys.secretboxKey, CONFIG.nonceCounter)
  this.decrypt = cryptoUtil.Decrypt(this.serializer, opts.keys.secretboxKey)
  this.sign = cryptoUtil.Sign(opts.keys.secretKey)
  this.putConcurrency = opts.putConcurrency || CONFIG.PUT_CONCURRENCY
  // Like put() but with limited concurrency to avoid out of memory/connection
  // errors (net::ERR_INSUFFICIENT_RESOURCES)
  this.bufferedPut = limitConcurrency(RequestUtil.prototype.put, this.putConcurrency)
  if (opts.credentialsBytes) {
    const credentials = this.parseAWSResponse(opts.credentialsBytes)
    this.saveAWSCredentials(credentials)
  }
  this.SQSUrlByCat = []
  this.oldSQSUrlByCat = []
  this.missingObjectsCache = new LRUCache(50)
  // This is used to keep the most recent records for each object id
  this.latestRecordsCache = new LRUCache(100)
}

/**
 * Save parsed AWS credential response to be used with AWS requests.
 * @param {{s3: Object, postData: Object, expiration: string, bucket: string, region: string}}
 * @return {Promise} After it resolves, the object is ready to make requests.
 */
RequestUtil.prototype.refreshAWSCredentials = function () {
  // Timestamp checked in server/lib/request-verifier.js
  const timestampString = Math.floor(Date.now() / 1000).toString()
  const userId = window.encodeURIComponent(this.userId)
  const url = `${this.serverUrl}/${userId}/credentials`
  const bytes = this.serializer.stringToByteArray(timestampString)
  const params = {
    method: 'POST',
    body: this.sign(bytes)
  }
  return window.fetch(url, params)
    .then((response) => {
      if (response.ok) {
        return response.arrayBuffer()
      }
      if (response.status === 400) {
        // Bad request
        return response.text().then((text) => {
          // See server/lib/request-verifier.js for error strings
          throw new Error(`Credential server response 400. ${text}`)
        })
      } else {
        throw new Error(`Credential server response ${response.status}`)
      }
    })
    .then((buffer) => {
      console.log('Refreshed credentials.')
      const credentials = this.parseAWSResponse(new Uint8Array(buffer))
      this.saveAWSCredentials(credentials)
      return Promise.resolve(this)
    })
}

/**
 * Save parsed AWS credential response to be used with AWS requests.
 * @param {{s3: Object, postData: Object, expiration: string, bucket: string, region: string}}
 */
RequestUtil.prototype.saveAWSCredentials = function (parsedResponse) {
  this.s3 = parsedResponse.s3
  this.postData = parsedResponse.postData
  this.expiration = parsedResponse.expiration
  this.bucket = parsedResponse.bucket
  this.region = parsedResponse.region
  this.s3PostEndpoint = `https://${this.bucket}.s3.dualstack.${this.region}.amazonaws.com`

  this.sqs = parsedResponse.sqs
  this.listInProgress = undefined
}

/**
 * Parses an AWS credentials endpoint response.
 * @param {Uint8Array} bytes response body
 * @return {{s3: Object, postData: Object, expiration: string, bucket: string, region: string}}
 */
RequestUtil.prototype.parseAWSResponse = function (bytes) {
  const parsedBody = this.serializer.byteArrayToCredentials(bytes)
  const credentials = parsedBody.aws
  if (!credentials) {
    throw new Error('AWS did not return credentials!')
  }
  const postData = parsedBody.s3Post
  if (!postData) {
    throw new Error('AWS did not return s3Post data!')
  }
  const region = parsedBody.region
  if (!region) {
    throw new Error('AWS did not return region!')
  }
  const bucket = parsedBody.bucket
  if (!bucket) {
    throw new Error('AWS did not return bucket!')
  }
  const expiration = credentials.expiration
  const s3 = new awsSdk.S3({
    convertResponseTypes: false,
    credentials: new awsSdk.Credentials({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    }),
    // The bucket name is prepended to the endpoint to build the actual request URL, e.g.
    // https://brave-sync-staging.s3.dualstack.us-west-2.amazonaws.com
    endpoint: `https://s3.dualstack.${region}.amazonaws.com`,
    maxRetries: CONFIG.SERVICES_MAX_RETRIES,
    region: region,
    sslEnabled: true,
    useDualstack: true
  })
  const sqs = new awsSdk.SQS({
    credentials: new awsSdk.Credentials({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    }),
    endpoint: `https://sqs.${region}.amazonaws.com`,
    maxRetries: CONFIG.SERVICES_MAX_RETRIES,
    region: region,
    sslEnabled: true
  })

  return { s3, postData, expiration, bucket, region, sqs }
}

/**
 * Get S3 objects in a category.
 * @param {string} category - the category ID
 * @param {number=} startAt return objects with timestamp >= startAt (e.g. 1482435340)
 * @param {number=} maxRecords Limit response to a given number of recods. By default the Sync lib will fetch all matching records, which might take a long time. If falsey, fetch all records.
 * @param {{
 *    compaction {boolean} // compact records while list object from S3
 *    compactionDoneCb {function} // callback when compaction is done
 *    compactionUpdateCb {function} // callback for client to update missing local records
 *  }} opts
 * @returns {Promise(Array.<Object>)}
 */
RequestUtil.prototype.list = function (category, startAt, maxRecords, nextContinuationToken, opts = {}) {
  const prefix = `${this.apiVersion}/${this.userId}/${category}`
  const options = {
    MaxKeys: maxRecords || 1000,
    Bucket: this.bucket,
    Prefix: prefix
  }
  if (nextContinuationToken !== '') {
    options.ContinuationToken = nextContinuationToken
  }
  if (startAt) { options.StartAfter = `${prefix}/${startAt}` }
  return this.withRetry(() => {
    if (this.shouldListObject(startAt, category) || opts.compaction) {
      const s3ObjectsPromise = s3Helper.listObjects(this.s3, options, !!maxRecords)
      if (!opts.compaction) {
        return s3ObjectsPromise
      }
      return new Promise((resolve, reject) => {
        s3ObjectsPromise.then((s3Objects) => {
          const compactedRecords = this.compactObjects(s3Objects.contents)
          if (opts.compactionUpdateCb) {
            opts.compactionUpdateCb(compactedRecords)
          }
          // wait for 15 seconds between batches
          setTimeout(() => {
            if (s3Objects.isTruncated) {
              return this.list(category, startAt, maxRecords, s3Objects.nextContinuationToken, opts)
            }
            return new Promise((resolve, reject) => {
              // compaction is done
              if (opts.compactionDoneCb) {
                opts.compactionDoneCb()
              }
              resolve()
            })
          }, 15000)
        })
        resolve()
      })
    }

    if (!this.SQSUrlByCat[category]) {
      console.error(`Could not find SQS url for category ${category}`)
      throw new Error(`Could not find SQS url for category '${category}'`)
    }

    // We poll from SQS
    const notificationParams = {
      QueueUrl: `${this.SQSUrlByCat[category]}`,
      AttributeNames: [
        'All'
      ],
      MaxNumberOfMessages: CONFIG.SQS_MAX_LIST_MESSAGES_COUNT,
      MessageAttributeNames: [
        'All'
      ],
      VisibilityTimeout: CONFIG.SQS_MESSAGES_VISIBILITY_TIMEOUT,
      WaitTimeSeconds: CONFIG.SQS_MESSAGES_LONGPOLL_TIMEOUT
    }

    // We will fetch from both old and new SQS queues until old one gets retired
    if (this.oldSQSUrlByCat[category]) {
      const oldNotificationParams = Object.assign({}, notificationParams)
      oldNotificationParams.QueueUrl = `${this.oldSQSUrlByCat[category]}`

      return s3Helper.listNotifications(
        this.sqs, notificationParams, category, prefix).then((values) => {
        if (this.shouldRetireOldSQSQueue(parseInt(values.createdTimeStamp))) {
          return this.deleteSQSQueue(this.oldSQSUrlByCat[category]).then(() => {
            delete this.oldSQSUrlByCat[category]
            return values
          })
        }
        return s3Helper.listNotifications(
          this.sqs, oldNotificationParams, category, prefix).then((oldValues) => {
          if (deepEqual(values.contents, oldValues.contents, { strict: true })) {
            return values
          }
          return {
            contents: values.contents.concat(oldValues.contents),
            createdTimeStamp: values.createdTimeStamp
          }
        })
      })
    }
    return s3Helper.listNotifications(this.sqs, notificationParams, category, prefix)
  })
}

/**
 * Array of categories which have queue in SQS
 */
const CATEGORIES_FOR_SQS = [proto.categories.BOOKMARKS, proto.categories.PREFERENCES]

/**
 * Checks do we need to use s3 list Object or SQS notifications
 * @param {number=} startAt return objects with timestamp >= startAt (e.g. 1482435340). Could be seconds or milliseconds
 * @param {string} category - the category ID
 * @returns {boolean}
*/
RequestUtil.prototype.shouldListObject = function (startAt, category) {
  const currentTime = new Date().getTime()
  const startAtToCheck = this.normalizeTimestampToMs(startAt, currentTime)

  return !startAtToCheck ||
      (currentTime - startAtToCheck) > parseInt(s3Helper.SQS_RETENTION, 10) * 1000 ||
      !CATEGORIES_FOR_SQS.includes(category) ||
      this.listInProgress === true
}

/**
 * The retention time of our SQS queue is 24 hours so we will retire old SQS
 * queue created by device id after 24 hours
 * @param {number=} createdTimestamp is the when new device id v2 queue was
 * created
 * @returns {boolean}
 */
RequestUtil.prototype.shouldRetireOldSQSQueue = function (createdTimestamp) {
  const currentTime = new Date().getTime()
  const newQueueCreatedTime =
    this.normalizeTimestampToMs(createdTimestamp, currentTime)

  return (currentTime - newQueueCreatedTime) > parseInt(s3Helper.SQS_RETENTION, 10) * 1000
}

/**
 * Checks do we need to use s3 list Object or SQS notifications
 * @param {number=} startAt return objects with timestamp >= startAt (e.g. 1482435340). Could be seconds or milliseconds
 * @param {number=} currentTime currentTime in milliseconds
 * @returns {number=}
*/
RequestUtil.prototype.normalizeTimestampToMs = function (startAt, currentTime) {
  let startAtToCheck = startAt
  if (startAtToCheck && currentTime.toString().length - startAtToCheck.toString().length >= 3) {
    startAtToCheck *= 1000
  }

  return startAtToCheck
}

/**
 * Sets if the initial sync done or not
 * @param {boolean}
 */
RequestUtil.prototype.setListInProgress = function (listInProgress) {
  this.listInProgress = listInProgress
}

/**
 * SQS queue name for a device
 * @param {string} deviceId
 * @returns {string}
 */
RequestUtil.prototype.sqsName = function (deviceId, category) {
  // How it was:
  // Lambda uses 'function getSQSPrefix(bucket, apiVersion, user)'
  // which calculates ${this.bucket}-${this.apiVersion}-${this.userIdBase62}
  // and then in lambda 'sqs.listQueues' lists all queues representing
  // devices in chain:
  //  dev0 "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-0"
  //  dev1 "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-1"
  //  dev2 "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-2"
  //  ...

  // How it is modified
  // Lambda uses 'function getSQSPrefix(bucket, apiVersion, user, category)'
  // which calculates:
  // - for preferences: ${this.bucket}-${this.apiVersion}-${this.userIdBase62}-c${category}
  // - for bookmarks: ${this.bucket}-${this.apiVersion}-${this.userIdBase62}
  // and then in lambda 'sqs.listQueues' lists all queues representing queues
  // of given catergory through all devices:
  // dev0 bookmarks "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-0"
  // dev0 preferences "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-0-c2"
  // dev1 bookmarks "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-1"
  // dev1 preferences "...${this.bucket}-${this.apiVersion}-${this.userIdBase62}-1-c2"
  // ...
  // Note SQS name for bookmarks remains the old, for compatibility

  var queueName = ''
  if (category === proto.categories.BOOKMARKS) {
    queueName = `${this.bucket}-${this.apiVersion}-${this.userIdBase62}-${deviceId}`
  } else if (category === proto.categories.PREFERENCES) {
    queueName = `${this.bucket}-${this.apiVersion}-${this.userIdBase62}-${deviceId}-c${category}`
  } else {
    throw new Error(`Could not make SQS name for unknown category '${category}'`)
  }
  return queueName
}

/**
 * Main purpose of this function is to create old SQS queue to test device id v2
 * migration
 * @param {string} deviceId
 * @returns {Promise}
 */
RequestUtil.prototype.createAndSubscribeSQSForTest = function (deviceId) {
  var createSQSPromises = []
  // Simple for loop instead foreach to capture 'this'
  for (var i = 0; i < CATEGORIES_FOR_SQS.length; ++i) {
    createSQSPromises.push(createAndSubscribeSQSforCategory(deviceId, CATEGORIES_FOR_SQS[i], this))
  }

  return Promise.all(createSQSPromises)
}

/**
 * Creates SQS for the current device.
 * @param {string} deviceId
 * @param {string} deviceIdV2
 * @returns {Promise}
 */
RequestUtil.prototype.createAndSubscribeSQS = function (deviceId, deviceIdV2) {
  // Creating a query for the current userId
  if (!deviceIdV2) {
    throw new Error('createSQS failed. deviceIdV2 is null!')
  }
  this.deviceIdV2 = deviceIdV2

  const subscribeOldSQSforCategory = function (deviceId, category, thisRef) {
    return new Promise((resolve, reject) => {
      const params = {
        QueueName: thisRef.sqsName(deviceId, category)
      }
      thisRef.sqs.getQueueUrl(params, (error, data) => {
        if (error) {
          // queue doesn't exist
          resolve()
        } else if (data) {
          thisRef.oldSQSUrlByCat[category] = data.QueueUrl
          resolve()
        }
      })
    })
  }
  var createSQSPromises = []
  // Simple for loop instead foreach to capture 'this'
  for (var i = 0; i < CATEGORIES_FOR_SQS.length; ++i) {
    // Doesn't have to create about to deprecated queues
    createSQSPromises.push(subscribeOldSQSforCategory(deviceId, CATEGORIES_FOR_SQS[i], this))
    createSQSPromises.push(createAndSubscribeSQSforCategory(deviceIdV2, CATEGORIES_FOR_SQS[i], this))
  }

  return Promise.all(createSQSPromises)
}

/**
 * From an array of S3 keys, extract and decrypt records.
 * @param {Array.<Uint8Array>} s3Objects resolved result of .list()
 * @returns {Array.<Object>}
 */
RequestUtil.prototype.s3ObjectsToRecords = function (s3Objects) {
  const crc = require('crc')
  const radix64 = require('../lib/radix64')
  const output = []
  const partBuffer = {}
  const objectMap = {}
  // restore the partBuffer from last round
  this.missingObjectsCache.forEach((value, key, cache) => {
    partBuffer[key] = value
  })
  for (const s3Object of s3Objects) {
    const parsedKey = s3Helper.parseS3Key(s3Object.Key)
    const fullCrc = parsedKey.recordCrc
    let data = parsedKey.recordPartString
    if (partBuffer[fullCrc]) {
      partBuffer[fullCrc] = partBuffer[fullCrc].concat(data)
      data = partBuffer[fullCrc]
    }
    if (objectMap[fullCrc]) {
      objectMap[fullCrc].push(s3Object.Key)
    } else {
      objectMap[fullCrc] = [s3Object.Key]
    }
    const dataBytes = s3Helper.s3StringToByteArray(data)
    const dataCrc = radix64.fromNumber(crc.crc32.unsigned(dataBytes.buffer))
    if (dataCrc === fullCrc) {
      let decrypted = {}
      try {
        decrypted = this.decrypt(dataBytes)
        decrypted.syncTimestamp = parsedKey.timestamp
        output.push(
          {
            record: decrypted,
            objects: objectMap[fullCrc]
          })
      } catch (e) {
        console.log(`Record with CRC ${crc} can't be decrypted: ${e}`)
      }
      if (partBuffer[fullCrc]) { delete partBuffer[fullCrc] }
      if (this.missingObjectsCache.has(fullCrc)) { this.missingObjectsCache.del(fullCrc) }
    } else {
      partBuffer[fullCrc] = data
    }
  }
  for (const crc in partBuffer) {
    this.missingObjectsCache.set(crc, partBuffer[crc])
    console.log(`Record with CRC ${crc} is missing parts or corrupt.`)
  }
  return output
}

/**
 * Record S3 prefix with current timestamp.
 * {apiVersion}/{userId}/{category}/{timestamp}/
 * @returns {string}
 */
RequestUtil.prototype.currentRecordPrefix = function (category) {
  return `${this.apiVersion}/${this.userId}/${category}/${Date.now()}/`
}

/**
 * Puts a single record, splitting it into multiple objects if needed.
 * See also bufferedPut() assigned in the constructor.
 * @param {string=} category - the category ID
 * @param {object} record - the object content
 */
RequestUtil.prototype.put = function (category, record) {
  const thisCategory = category || recordUtil.getRecordCategory(record)
  if (!recordUtil.CATEGORY_IDS.includes(thisCategory)) {
    throw new Error(`Unsupported sync category: ${category}`)
  }
  const encryptedRecord = this.encrypt(record)
  const s3Prefix = this.currentRecordPrefix(thisCategory)
  const s3Keys = s3Helper.encodeDataToS3KeyArray(s3Prefix, encryptedRecord)
  return this.withRetry(() => {
    const fetchPromises = s3Keys.map((key, _i) => {
      const params = {
        method: 'POST',
        body: this.s3PostFormData(key)
      }
      return window.fetch(this.s3PostEndpoint, params)
        .then(checkFetchStatus)
    })
    return Promise.all(fetchPromises)
  })
}

/**
 * Compact all records in a category
 * @param {string=} category - the category ID
 * @returns {Array.<Object>} - records after compaction
 */
RequestUtil.prototype.compactObjects = function (s3Objects) {
  let s3ObjectsToDelete = []
  const compactedRecords = {}
  const recordObjects = this.s3ObjectsToRecords(s3Objects)
  recordObjects.forEach((recordObject) => {
    const record = recordObject.record
    const id = JSON.stringify(record.objectId)
    if (this.latestRecordsCache.has(id)) {
      console.log('compaction deletes')
      const cacheRecordObject = this.latestRecordsCache.get(id)
      if (record.syncTimestamp > cacheRecordObject.record.syncTimestamp) {
        s3ObjectsToDelete = s3ObjectsToDelete.concat(cacheRecordObject.objects)
        console.log(cacheRecordObject.record)
        this.latestRecordsCache.set(id, recordObject)
        compactedRecords[id] = record
      } else {
        s3ObjectsToDelete = s3ObjectsToDelete.concat(recordObject.objects)
        console.log(record)
      }
    } else {
      this.latestRecordsCache.set(id, recordObject)
      compactedRecords[id] = record
    }
  })
  s3Helper.deleteObjects(this.s3, this.bucket, s3ObjectsToDelete)
  return Object.values(compactedRecords)
}

RequestUtil.prototype.s3PostFormData = function (objectKey) {
  let formData = new FormData() // eslint-disable-line
  formData.append('key', objectKey)
  for (const key of Object.keys(this.postData)) {
    formData.append(key, this.postData[key])
  }
  formData.append('file', new Uint8Array([]))
  return formData
}

/**
 * In S3 you can't delete all keys matching a prefix, so you need to list by
 * prefix then delete them all.
 * @param {string} prefix
 */
RequestUtil.prototype.s3DeletePrefix = function (prefix) {
  return this.withRetry(() => {
    return s3Helper.deletePrefix(this.s3, this.bucket, prefix)
  })
}

RequestUtil.prototype.deleteUser = function () {
  return this.s3DeletePrefix(`${this.apiVersion}/${this.userId}`)
}

RequestUtil.prototype.purgeUserCategoryQueue = function (category) {
  return new Promise((resolve, reject) => {
    const params = {
      QueueName: this.sqsName(this.deviceIdV2, category)
    }
    this.sqs.getQueueUrl(params, (error, data) => {
      if (error) {
        console.log('SQS getQueueUrl failed with error: ' + error)
        resolve([])
        // Just ignore the error
      } else if (data) {
        const params = {
          QueueUrl: data.QueueUrl
        }
        this.sqs.purgeQueue(params, (errPurgeSQS, dataPurgeSQS) => {
          // Just ignore data or any error here
          if (errPurgeSQS) {
            console.log('SQS purgeQueue failed with error: ' + errPurgeSQS)
          }
          resolve([])
        })
      }
    })
  })
}

/**
 * Delete SQS queue by url
 * @param {string} url - SQS queue url
 */
RequestUtil.prototype.deleteSQSQueue = function (url) {
  return new Promise((resolve, reject) => {
    const params = {
      QueueUrl: url
    }
    this.sqs.deleteQueue(params, (err, data) => {
      if (err) {
        console.log('SQS deleteQueue failed with error: ' + err)
      }
      resolve([])
    })
  })
}

RequestUtil.prototype.purgeUserQueue = function () {
  var purgeQueuePromises = []
  for (var i = 0; i < CATEGORIES_FOR_SQS.length; ++i) {
    purgeQueuePromises.push(this.purgeUserCategoryQueue(CATEGORIES_FOR_SQS[i]))
  }

  return Promise.all(purgeQueuePromises)
}

/**
 * @param {string} category - the category ID
 */
RequestUtil.prototype.deleteCategory = function (category) {
  return this.s3DeletePrefix(`${this.apiVersion}/${this.userId}/${category}`)
}

/**
 * Delete site settings, which are stored in the preferences collection
 * alongside device records.
 */
RequestUtil.prototype.deleteSiteSettings = function () {
  const prefix = `${this.apiVersion}/${this.userId}/${proto.categories.PREFERENCES}`
  return s3Helper.deletePrefix(this.s3, this.bucket, prefix, (s3Object) => {
    // TODO: Recombine split records
    const parsedKey = s3Helper.parseS3Key(s3Object.Key)
    const decodedData = s3Helper.s3StringToByteArray(parsedKey.recordPartString)
    const record = this.decrypt(decodedData)
    const objectData = serializer.getSyncRecordObjectData(record)
    return objectData === 'siteSetting'
  })
}

/**
 * Wrapper to call a function and refresh credentials if needed.
 * @param {Function(Promise)} Function which returns a Promise.
 * @param {number} retries Retries left. You probably don't need to change this.
 * @param {Error=} previousError Buffer with the previous error, for internal use.
 */
RequestUtil.prototype.withRetry = function (myFun, retries = 1, previousError) {
  if (retries < 0) { throw previousError }

  return new Promise((resolve, reject) => {
    const callMyFun = () => {
      myFun()
        .then((...args) => { resolve(...args) })
        .catch((error) => {
          const retry = () => {
            try {
              this.withRetry(myFun, retries - 1, error)
                .then((...args) => { resolve(...args) })
                .catch((error) => { reject(error) })
            } catch (error) {
              reject(error)
            }
          }
          // window.fetch() requests. checkFetchStatus() appends responses.
          if (error.response) {
            error.response.text().then((body) => {
              error.message = error.message.concat(body)
              retry()
            })
          } else {
            retry()
          }
        })
    }
    if (previousError) {
      if (!isExpiredCredentialError(previousError)) { throw previousError }
      this.refreshAWSCredentials().then(callMyFun)
    } else {
      callMyFun()
    }
  })
}

module.exports = RequestUtil
