'use strict'

const initializer = require('./init')
const bookmarkUtil = require('./bookmarkUtil')
const RequestUtil = require('./requestUtil')
const recordUtil = require('./recordUtil')
const messages = require('./constants/messages')
const proto = require('./constants/proto')
const serializer = require('../lib/serializer')
const {deriveKeys} = require('../lib/crypto')

let ipc = window.chrome.ipcRenderer

// logging
const DEBUG = 0
const WARN = 1
const ERROR = 2
const logElement = document.querySelector('#output')

var clientDeviceId = null
var clientUserId = null
var clientKeys = {}
var config = {}
var seed
var nextContinuationTokens = {}
var isCompactionInProgress = false

/**
 * Logs stuff on the visible HTML page.
 * @param {string} message
 * @param {number} logLevel
 */
const logSync = (message, logLevel = DEBUG) => {
  if (logLevel === WARN) {
    message = `Warning: ${message}`
  } else if (logLevel === ERROR) {
    message = `ERROR: ${message}`
  }
  if (logElement) {
    logElement.innerText = `${logElement.innerText}\r\n${message}`
  } else if (ipc && config.debug) {
    ipc.send(messages.SYNC_DEBUG, message)
  } else {
    console.log(message)
  }
}

/**
 * Sets the device ID if one does not yet exist.
 * @param {RequestUtil} requester
 * @returns {Promise}
 */
const maybeSetDeviceId = (requester) => {
  if (clientDeviceId !== null) {
    return Promise.resolve(requester)
  }
  if (!requester || !requester.s3) {
    throw new Error('cannot set device ID because AWS SDK is not initialized.')
  }
  return requester.list(proto.categories.PREFERENCES)
    .then(s3Objects => requester.s3ObjectsToRecords(s3Objects.contents))
    .then((recordObjects) => {
      let maxId = -1
      if (recordObjects && recordObjects.length) {
        recordObjects.forEach((recordObject) => {
          const record = recordObject.record
          const device = record.device
          if (device && record.deviceId[0] > maxId) {
            maxId = record.deviceId[0]
          }
        })
      }
      clientDeviceId = new Uint8Array([maxId + 1])
      ipc.send(messages.SAVE_INIT_DATA, seed, clientDeviceId)
      return Promise.resolve(requester)
    })
}

/**
 * Starts the sync listeners.
 * @param {RequestUtil} requester
 */
const startSync = (requester) => {
  /**
   * Helper method to convert s3objects to decrypted JS records
   * @param {Array.<Uint8Array>} s3Objects
   * @param {function=} filterFunction Only return records where function returns true.
   * @returns  {Array.<Object>}
   */
  const getJSRecords = (s3Objects, filterFunction) => {
    const recordObjects = requester.s3ObjectsToRecords(s3Objects)
    let jsRecords = []
    for (let recordObject of recordObjects) {
      const record = recordObject.record
      const jsRecord = recordUtil.syncRecordAsJS(record)
      // Useful but stored in the S3 key.
      jsRecord.syncTimestamp = record.syncTimestamp
      if (typeof filterFunction === 'function' && filterFunction(jsRecord) !== true) {
        continue
      }
      jsRecords.push(jsRecord)
    }
    return jsRecords
  }

  ipc.on(messages.FETCH_SYNC_RECORDS, (e, categoryNames, startAt, limitResponse) => {
    logSync(`fetching ${categoryNames} records after ${startAt}`)
    categoryNames.forEach((category) => {
      if (!proto.categories[category]) {
        throw new Error(`Unsupported sync category: ${category}`)
      }
      let continuationToken = ''
      if (nextContinuationTokens[category]) {
        continuationToken = nextContinuationTokens[category]
      }
      requester.list(proto.categories[category], startAt, limitResponse, continuationToken).then((s3Objects) => {
        const jsRecords = getJSRecords(s3Objects.contents)
        logSync(`got ${jsRecords.length} decrypted records in ${category} after ${startAt}`)
        let lastRecordTimestamp
        if (jsRecords.length > 0) {
          lastRecordTimestamp = jsRecords[jsRecords.length - 1].syncTimestamp
        }
        if (!startAt && s3Objects.isTruncated) {
          requester.setListInProgress(true)
        } else if (!s3Objects.isTruncated) {
          requester.setListInProgress(false)
        }
        if (s3Objects.isTruncated) {
          // When is it truncated we need to provide continuation token, so system could understand where to continue from next time
          nextContinuationTokens[category] = s3Objects.nextContinuationToken
        } else {
          nextContinuationTokens[category] = ''
        }
        ipc.send(messages.GET_EXISTING_OBJECTS, category, jsRecords, lastRecordTimestamp, s3Objects.isTruncated)
      })
    })
  })
  ipc.on(messages.FETCH_SYNC_DEVICES, (e) => {
    logSync(`fetching devices`)
    requester.list(proto.categories['PREFERENCES'], 0).then((s3Objects) => {
      const isDevice = (jsRecord) => !!jsRecord.device
      const jsRecords = getJSRecords(s3Objects.contents, isDevice)
      logSync(`fetched ${jsRecords.length} devices`)
      ipc.send(messages.RESOLVED_SYNC_RECORDS, 'PREFERENCES', jsRecords)
    })
  })
  ipc.on(messages.RESOLVE_SYNC_RECORDS, (e, category, recordsAndExistingObjects) => {
    const resolvedRecords = recordUtil.resolveRecords(recordsAndExistingObjects)
    logSync(`resolved ${recordsAndExistingObjects.length} ${category} -> ${resolvedRecords.length}`)
    ipc.send(messages.RESOLVED_SYNC_RECORDS, category, resolvedRecords)
  })
  ipc.on(messages.SEND_SYNC_RECORDS, (e, category, records) => {
    logSync(`Sending ${records.length} records`)
    const categoryId = proto.categories[category]
    const promisePuts = []
    const sentRecords = []
    records.forEach((record) => {
      if (!record) {
        logSync(`could not send empty record`, ERROR)
        return
      }
      // Workaround #17
      record.deviceId = new Uint8Array(record.deviceId)
      record.objectId = new Uint8Array(record.objectId)
      if (record.bookmark && record.bookmark.parentFolderObjectId) {
        record.bookmark.parentFolderObjectId = new Uint8Array(record.bookmark.parentFolderObjectId)
      }
      promisePuts.push(
        requester.bufferedPut(categoryId, record).then(() => {
          logSync(`sending record: ${JSON.stringify(record)}`)
          sentRecords.push(record)
        }).catch((e) => {
          logSync(`could not send record ${JSON.stringify(record)}: ${e}`, ERROR)
        })
      )
    })
    Promise.all(promisePuts).then(() => {
      ipc.send(messages.SENT_SYNC_RECORDS, category, sentRecords)
    })
  })
  ipc.on(messages.DELETE_SYNC_USER, (e) => {
    logSync(`Deleting user!!`)
    requester.deleteUser().then(() => {
      requester.purgeUserQueue().then(() => {
        ipc.send(messages.DELETED_SYNC_USER)
      })
    })
  })
  ipc.on(messages.DELETE_SYNC_CATEGORY, (e, category) => {
    if (!proto.categories[category]) {
      throw new Error(`Unsupported sync category: ${category}`)
    }
    logSync(`Deleting category: ${category}`)
    requester.deleteCategory(proto.categories[category]).then(() => {
      requester.purgeUserQueue()
    })
  })
  ipc.on(messages.COMPACT_SYNC_CATEGORY, (e, category) => {
    if (!proto.categories[category]) {
      throw new Error(`Unsupported sync category: ${category}`)
    }
    const compactionDone = () => {
      ipc.send(messages.COMPACTED_SYNC_CATEGORY, category)
      isCompactionInProgress = false
    }
    const compactionUpdate = (records) => {
      let jsRecords = []
      for (let record of records) {
        const jsRecord = recordUtil.syncRecordAsJS(record)
        jsRecord.syncTimestamp = record.syncTimestamp
        jsRecords.push(jsRecord)
      }
      logSync(`Compaction records update category: ${category}`)
      ipc.send(messages.GET_EXISTING_OBJECTS, category, jsRecords, 0, false)
    }
    if (!isCompactionInProgress) {
      requester.list(proto.categories[category], 0, 1000, '',
        {compaction: true, compactionDoneCb: compactionDone, compactionUpdateCb: compactionUpdate}).then(() => {
        logSync(`Compacting category: ${category}`)
        isCompactionInProgress = true
      })
    }
  })
  ipc.on(messages.DELETE_SYNC_SITE_SETTINGS, (e) => {
    logSync(`Deleting siteSettings`)
    requester.deleteSiteSettings().then(() => {
      requester.purgeUserQueue()
    })
  })
  ipc.on(messages.GET_BOOKMARKS_BASE_ORDER, (e, deviceId, platform) => {
    logSync(`Getting bookmarks base order`)
    ipc.send(messages.SAVE_BOOKMARKS_BASE_ORDER, bookmarkUtil.getBaseBookmarksOrder(deviceId, platform))
  })
  ipc.on(messages.GET_BOOKMARK_ORDER, (e, prevOrder, nextOrder, parentOrder) => {
    logSync(`Getting current bookmark order based on prev, next and parent orders`)

    ipc.send(messages.SAVE_BOOKMARK_ORDER, bookmarkUtil.getBookmarkOrder(prevOrder, nextOrder, parentOrder), prevOrder, nextOrder, parentOrder)
  })
  ipc.send(messages.SYNC_READY)
  logSync('success')
}

const main = () => {
  if (!ipc) {
    logSync('chrome.ipcRenderer is missing!', ERROR)
    return
  }

  console.log(`in sync script ${window.location.href}`)

  Promise.all([serializer.init(), initializer.init()]).then((values) => {
    const clientSerializer = values[0]
    const keys = deriveKeys(values[1].seed)
    const deviceId = values[1].deviceId
    seed = values[1].seed
    clientKeys = keys
    config = values[1].config
    if (deviceId instanceof Uint8Array && deviceId.length === 1) {
      clientDeviceId = deviceId
      logSync(`initialized deviceId ${clientDeviceId}`)
    }
    if (keys.publicKey instanceof Uint8Array) {
      clientUserId = window.btoa(String.fromCharCode.apply(null, keys.publicKey))
    }
    if (!clientUserId || !clientKeys.secretKey) {
      throw new Error('Missing userID or keys')
    }
    if (!config || !config.serverUrl || typeof config.apiVersion !== 'string') {
      throw new Error('Missing client env configuration')
    }
    logSync(`initialized userId ${clientUserId}`)
    return clientSerializer
  })
    .then((clientSerializer) => {
      const requester = new RequestUtil({
        apiVersion: config.apiVersion,
        credentialsBytes: null, // TODO: Start with previous session's credentials
        keys: clientKeys,
        serializer: clientSerializer,
        serverUrl: config.serverUrl
      })
      return requester.refreshAWSCredentials()
    })
    .then((requester) => {
      logSync('successfully authenticated userId: ' + clientUserId)
      logSync('using AWS bucket: ' + requester.bucket)
      return maybeSetDeviceId(requester)
    })
    .then((requester) => {
      if (clientDeviceId !== null && requester && requester.s3) {
        logSync('set device ID: ' + clientDeviceId)
        requester.createAndSubscribeSQS(clientDeviceId).then(() => {
          startSync(requester)
        })
          .catch((e) => {
            logSync('could not init sync on creation SQS: ' + e, ERROR)
            ipc.send(messages.SYNC_SETUP_ERROR, e.message)
          })
      }
    })
    .catch((e) => {
      logSync('could not init sync: ' + e, ERROR)
      ipc.send(messages.SYNC_SETUP_ERROR, e.message)
    })
}

main()
