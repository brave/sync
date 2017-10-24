'use strict'

// it helps you with s3

const S3_KEY_SIZE_MAX = 1024
// 1-digit in radix64 limits records to 64 parts * 800 bytes/part ~= 50 KiB
const S3_PART_INDEX_DIGITS = 1
const S3_PART_LIMIT = 64
const SQS_LIST_MAX_COUNT = 5
const SQS_GET_DELETE_MESSAGES_BATCH_SIZE = 10

module.exports.SQS_RETENTION = '86400'  // In seconds

/**
* Encodes a byte array as an S3 key-safe string
* @param {Uint8Array} bytes
* @returns {string}
*/
module.exports.byteArrayToS3String = function (bytes/* : Uint8Array */) {
  return Buffer.from(bytes).toString('base64')
}

/**
 * Decodes a S3 key-safe string to a byte array
 * @param {string} msg
 * @returns {Uint8Array}
 */
module.exports.s3StringToByteArray = function (msg/* : string */) {
  return new Uint8Array(Buffer.from(msg, 'base64'))
}

/**
 * Takes a common prefix and a large record and splits the record into pieces
 * in several S3 object keys.
 * @param {string} s3Prefix like '0/asdf/0/12345678/'
 * @param {Uint8Array} data
 * @returns {Array.<string>} ['prefix/
 */
module.exports.encodeDataToS3KeyArray = function (s3Prefix, data) {
  const crc = require('crc')
  const radix64 = require('./radix64')

  if (!s3Prefix) { throw new Error('s3 Prefix is required') }
  if (s3Prefix.substring(s3Prefix.length - 1) !== '/') {
    s3Prefix = s3Prefix.concat('/')
  }
  const dataCrc = radix64.fromNumber(crc.crc32.unsigned(data))

  // {prefix/}{dataCrc}/{partIndex}/ + {partData}
  const maxPartSize = S3_KEY_SIZE_MAX - s3Prefix.length - dataCrc.length - 1 - S3_PART_INDEX_DIGITS - 1
  const dataS3Encoded = this.byteArrayToS3String(data)
  const partCount = Math.ceil(dataS3Encoded.length / maxPartSize)
  if (partCount > S3_PART_LIMIT) {
    throw new Error(`Data is too big; part limit is ${S3_PART_LIMIT}.`)
  }

  let s3Keys = []
  for (let i = 0; i < partCount; i++) {
    const cursor = i * maxPartSize
    const dataPart = dataS3Encoded.slice(cursor, cursor + maxPartSize)
    const key = s3Prefix.concat(radix64.fromNumber(i), '/', dataCrc, '/', dataPart)
    s3Keys.push(key)
  }
  return s3Keys
}

/**
 * Parse S3 key into an object
 * @param {string} key
 * @returns {{apiVersion: <string>, userId: <string>, categoryId: <string>, timestamp: <string>, recordCrc: <number>, recordPartIndex: <number>, recordPartString: <string>}}
 */
module.exports.parseS3Key = function (key) {
  const apiVersion = key.substring(0, 1)
  const userId = key.substring(2, 47)
  const otherParts = key.substring(47).split('/')
  const categoryId = otherParts[0]
  const timestamp = parseInt(otherParts[1])
  const recordPartIndex = parseInt(otherParts[2])
  const recordCrc = otherParts[3]
  const recordPartString = otherParts.slice(4).join('/')
  return {apiVersion, userId, categoryId, timestamp, recordCrc, recordPartIndex, recordPartString}
}

/**
 * list SQS notifications.
 * @param {AwsSdk.SQS} SQS
 * @param {Object} options  // Options to list messages via SQS
 * @param {string} category // Category of records(bookmarks, history, ...)
 * @param {string} prefix // Prefix to check that we received a correct category record
  * @returns {Promise}
 */
module.exports.listNotifications = function (SQS, options, category, prefix) {
  return new Promise((resolve, reject) => {
    let content = []
    let entriesToDelete = []
    let currentCount = 0
    let maxCount = SQS_LIST_MAX_COUNT

    let queueAttributesParams = {
      QueueUrl: options.QueueUrl,
      AttributeNames: [
        'ApproximateNumberOfMessages'
      ]
    }
    SQS.getQueueAttributes(queueAttributesParams, (errorAttr, dataAttr) => {
      if (errorAttr) {
        console.log('SQS.getQueueAttributes failed with error: ' + errorAttr)
        reject(errorAttr)
      } else if (dataAttr) {
        if (dataAttr.Attributes.ApproximateNumberOfMessages === 0) {
          resolve({
            contents: content
          })

          return
        }
        let loopsCount = Math.floor(dataAttr.Attributes.ApproximateNumberOfMessages / SQS_GET_DELETE_MESSAGES_BATCH_SIZE)
        if (loopsCount + 1 < maxCount) {
          maxCount = loopsCount + 1
        }
        listNotificationsRecursively(SQS, options, category, prefix, currentCount, maxCount,
          content, entriesToDelete, (error, data) => {
            if (error) {
              reject(error)
            }
            resolve({
              contents: data
            })
          })
      }
    })
  })
}

function listNotificationsRecursively (SQS, options, category, prefix, currentCount, maxCount, currentContent, currentEntriesToDelete, callback) {
  SQS.receiveMessage(options, (error, data) => {
    if (error) {
      console.log('SQS.receiveMessage failed with error: ' + error)
      callback(error, null)
    } else if (data) {
      for (let message of data.Messages) {
        let key = ''
        if (message.Body) {
          var bodyObject = JSON.parse(message.Body)
          if (bodyObject && bodyObject.Message) {
            var recordsObject = JSON.parse(bodyObject.Message)
            if (recordsObject && recordsObject.Records && recordsObject.Records[0] &&
                recordsObject.Records[0].s3 && recordsObject.Records[0].s3.object &&
                recordsObject.Records[0].s3.object.key) {
              key = recordsObject.Records[0].s3.object.key
            }
          }
        }
        // Poll only bookmark messages for now and delete notifications with other records
        if (key.indexOf(prefix) === 0) {
          let contentMessage = {
            Key: `${decodeURIComponent(key)}`
          }
          currentContent.push(contentMessage)
        }
        let entryToDelete = {
          Id: `${currentEntriesToDelete.length}`,
          ReceiptHandle: message.ReceiptHandle
        }
        currentEntriesToDelete.push(entryToDelete)
        if (currentEntriesToDelete.length === SQS_GET_DELETE_MESSAGES_BATCH_SIZE) {
          deleteSQSMessages(SQS, currentEntriesToDelete, options.QueueUrl)
          currentEntriesToDelete = []
        }
      }
      currentCount++
      if (currentCount >= maxCount) {
        deleteSQSMessages(SQS, currentEntriesToDelete, options.QueueUrl)
        currentEntriesToDelete = []
        callback(null, currentContent)
      } else {
        listNotificationsRecursively(SQS, options, category, prefix, currentCount,
            maxCount, currentContent, currentEntriesToDelete, callback)
      }
    }
  })
}

function deleteSQSMessages (SQS, currentEntriesToDelete, queueUrl) {
  if (currentEntriesToDelete.length) {
    let deleteMessagesOptions = {
      QueueUrl: queueUrl,
      Entries: currentEntriesToDelete
    }
    SQS.deleteMessageBatch(deleteMessagesOptions, (errorDelete, dataDelete) => {
      if (errorDelete) {
        console.log('SQS delete message error == ' + errorDelete)
      }
    })
  }
}

/**
 * listObjectsV2 plus follow all cursors.
 * @param {AwsSdk.S3} s3
 * @param {Object} options
 * @param {boolean=} limitResponse Limit response to a given number. By default the Sync lib will fetch all matching records, which might take a long time.
 * @returns {Promise}
 */
module.exports.listObjects = function (s3, options, limitResponse) {
  return new Promise((resolve, reject) => {
    if (limitResponse) {
      s3.listObjectsV2(options, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            contents: data.Contents,
            isTruncated: data.IsTruncated
          })
        }
      })
    } else {
      listObjectsV2Recursively(s3, options, (error, data) => {
        if (error) { reject(error) }
        resolve({
          contents: data,
          isTruncated: false
        })
      })
    }
  })
}

function listObjectsV2Recursively (s3, options, callback, contentsThusFar) {
  if (!contentsThusFar) { contentsThusFar = [] }
  s3.listObjectsV2(options, (error, data) => {
    if (error) {
      callback(error, null)
      return
    }
    const contents = data.Contents
    contentsThusFar = contentsThusFar.concat(contents)
    if (data.IsTruncated) {
      options.ContinuationToken = data.NextContinuationToken
      listObjectsV2Recursively(s3, options, callback, contentsThusFar)
    } else {
      callback(null, contentsThusFar)
    }
  })
}

/**
 * In S3 you can't delete all keys matching a prefix, so you need to list by
 * prefix then delete them all.
 * @param {AwsSdk.S3} s3
 * @param {string} bucket
 * @param {string} prefix
 * @param {Function=} deleteIf Only delete if s3Object passes this condition.
 * @returns {Promise(Array)}
 */
module.exports.deletePrefix = function (s3, bucket, prefix, deleteIf) {
  const options = {
    MaxKeys: 1000,
    Bucket: bucket,
    Prefix: prefix
  }
  return new Promise((resolve, reject) => {
    const listAndDelete = (token) => {
      options.ContinuationToken = token
      s3.listObjectsV2(options, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (!data.Contents) {
          reject(new Error('Missing object contents.'))
          return
        }
        if (data.Contents.length === 0) {
          resolve([])
          return
        }
        let deleteObjects = []
        for (let content of data.Contents) {
          if (deleteIf && deleteIf(content) !== true) { continue }
          deleteObjects.push({Key: content.Key})
        }
        const deletePromise = (deleteObjects.length > 0) && s3.deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: deleteObjects
          }
        }).promise()
        let listAndDeletePromise = null
        if (data.IsTruncated && data.NextContinuationToken) {
          listAndDeletePromise = listAndDelete(data.NextContinuationToken)
        }
        Promise.all([deletePromise, listAndDeletePromise])
          .then((data) => { resolve(data) })
          .catch((error) => { reject(error) })
      })
    }
    listAndDelete()
  })
}
