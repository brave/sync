'use strict'

const initializer = require('./init')
const RequestUtil = require('./requestUtil')
const recordUtil = require('./recordUtil')
const messages = require('./constants/messages')
const proto = require('./constants/proto')
const serializer = require('../lib/serializer')

const ipc = window.chrome.ipcRenderer

// logging
const DEBUG = 0
const WARN = 1
const ERROR = 2
const logElement = document.querySelector('#output')

var clientDeviceId = null
var clientUserId = null
var clientKeys = {}
var config = {}

console.log('in sync script')

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
  } else if (config.debug) {
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
    .then((records) => {
      let maxId = -1
      if (records && records.length) {
        records.forEach((bytes) => {
          var record = {}
          try {
            record = requester.decrypt(bytes)
          } catch (e) {
            return
          }
          const device = record.device
          if (device && record.deviceId[0] > maxId) {
            maxId = record.deviceId[0]
          }
        })
      }
      clientDeviceId = new Uint8Array([maxId + 1])
      ipc.send(messages.SAVE_INIT_DATA, undefined, clientDeviceId)
      return Promise.resolve(requester)
    })
}

/**
 * Starts the sync listeners.
 * @param {RequestUtil} requester
 */
const startSync = (requester) => {
  ipc.send(messages.SYNC_READY)
  ipc.on(messages.FETCH_SYNC_RECORDS, (e, categoryNames, startAt) => {
    logSync(`fetching ${categoryNames} records after ${startAt}`)
    categoryNames.forEach((category) => {
      if (!proto.categories[category]) {
        throw new Error(`Unsupported sync category: ${category}`)
      }
      requester.list(proto.categories[category], startAt).then((records) => {
        ipc.send(messages.GET_EXISTING_OBJECTS, category, records)
      })
    })
  })
  ipc.on(messages.RESOLVE_SYNC_RECORDS, (e, category, recordsAndExistingObjects) => {
    let resolvedRecords = []
    logSync(`resolving ${recordsAndExistingObjects.length} records`)
    recordsAndExistingObjects.forEach(([record, existingObject]) => {
      const resolved = recordUtil.resolve(record, existingObject)
      if (resolved) { resolvedRecords.push(resolved) }
    })
    if (resolvedRecords.length > 0) {
      ipc.send(messages.RESOLVED_SYNC_RECORDS, category, resolvedRecords)
    }
  })
  ipc.on(messages.SEND_SYNC_RECORDS, (e, category, records) => {
    if (!proto.categories[category]) {
      throw new Error(`Unsupported sync category: ${category}`)
    }
    records.forEach((record) => {
      // Workaround #17
      record.deviceId = new Uint8Array(record.deviceId)
      record.objectId = new Uint8Array(record.objectId)
      logSync(`sending record: ${JSON.stringify(record)}`)
      requester.put(proto.categories[category], requester.encrypt(record))
    })
  })
  ipc.on(messages.DELETE_SYNC_USER, (e) => {
    logSync(`Deleting user!!`)
    requester.deleteUser()
  })
  ipc.on(messages.DELETE_SYNC_CATEGORY, (e, category) => {
    if (!proto.categories[category]) {
      throw new Error(`Unsupported sync category: ${category}`)
    }
    logSync(`Deleting category: ${category}`)
    requester.deleteCategory(proto.categories[category])
  })
  logSync('success')
}

Promise.all([serializer.init(), initializer.init(window.chrome)]).then((values) => {
  const clientSerializer = values[0]
  const keys = values[1].keys
  const deviceId = values[1].deviceId
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
      startSync(requester)
    }
  })
  .catch((e) => { logSync('could not init sync: ' + e, ERROR) })
