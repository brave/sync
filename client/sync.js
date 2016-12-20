'use strict'

const initializer = require('./init')
const RequestUtil = require('./requestUtil')
const messages = require('./constants/messages')
const proto = require('./constants/proto')
const serializer = require('../lib/serializer')
const crypto = require('../lib/crypto')
const conf = require('./config')

const ipc = window.chrome.ipc

// logging
const DEBUG = 0
const WARN = 1
const ERROR = 2
const logElement = document.querySelector('#output')

var clientSerializer = null
var clientDeviceId = null
var clientUserId = null
var clientKeys = {}
var config = {}

// aws sdk requests class
var requester = {}

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
  logElement.innerText = `${logElement.innerText}\r\n${message}`
}

/**
 * decrypt then deserialize a message.
 * @param {Uint8Array} ciphertext
 * @returns {Object}
 */
const decrypt = (ciphertext) => {
  const d = clientSerializer.byteArrayToSecretBoxRecord(ciphertext)
  const decrypted = crypto.decrypt(d.encryptedData,
    d.nonceRandom, clientKeys.secretboxKey)
  if (!decrypted) {
    throw new Error('Decryption failed.')
  }
  return clientSerializer.byteArrayToSyncRecord(decrypted)
}

/**
 * serialize then encrypts a sync record
 * @param {Object} message
 * @returns {Uint8Array}
 */
const encrypt = (message) => {
  const s = clientSerializer.syncRecordToByteArray(message)
  const nonceRandom = crypto.randomBytes(20)
  const encrypted = crypto.encrypt(s, clientKeys.secretboxKey,
    conf.counter, nonceRandom)
  return clientSerializer.secretBoxRecordToBytes({
    nonceRandom,
    counter: conf.counter,
    encryptedData: encrypted.ciphertext
  })
}

/**
 * Gets AWS creds.
 * @returns {Promise}
 */
const getAWSCredentials = () => {
  const serverUrl = config.serverUrl
  const now = Math.floor(Date.now() / 1000).toString()
  if (clientSerializer === null) {
    throw new Error('Serializer not initialized.')
  }
  const userId = window.encodeURIComponent(clientUserId)
  const request = new window.Request(`${serverUrl}/${userId}/credentials`, {
    method: 'POST',
    body: crypto.sign(clientSerializer.stringToByteArray(now), clientKeys.secretKey)
  })
  return window.fetch(request)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Credential server response ' + response.status)
      }
      return response.arrayBuffer()
    })
    .then((buffer) => {
      requester = new RequestUtil(clientSerializer, new Uint8Array(buffer),
        config.apiVersion, clientUserId)
      if (!requester.s3) {
        throw new Error('could not initialize AWS SDK')
      }
    })
}

/**
 * Sets the device ID if one does not yet exist.
 * @returns {Promise}
 */
const maybeSetDeviceId = () => {
  if (clientDeviceId !== null) {
    return
  }
  if (!requester.s3) {
    throw new Error('cannot set device ID because AWS SDK is not initialized.')
  }
  return requester.list(proto.categories.PREFERENCES)
    .then((records) => {
      let maxId = -1
      if (records && records.length) {
        records.forEach((bytes) => {
          var record = {}
          try {
            record = decrypt(bytes)
          } catch (e) {
            return
          }
          const device = record.device
          if (device && device.deviceId && device.deviceId[0] > maxId) {
            maxId = device.deviceId[0]
          }
        })
      }
      clientDeviceId = new Uint8Array([maxId + 1])
      ipc.send(messages.SAVE_INIT_DATA, undefined, clientDeviceId)
    })
}

/**
 * Starts the sync listeners.
 */
const startSync = () => {
  ipc.send(messages.SYNC_READY)
  ipc.on(messages.FETCH_SYNC_RECORDS, (categoryNames) => {
    categoryNames.forEach((category) => {
      if (!proto.categories[category]) {
        throw new Error(`Unsupported sync category: ${category}`)
      }
      requester.list(category).then((records) => {
        ipc.send(messages.RECEIVE_SYNC_RECORDS, category, records)
      })
    })
  })
  ipc.on(messages.SEND_SYNC_RECORDS, (category, records) => {
    if (!proto.categories[category]) {
      throw new Error(`Unsupported sync category: ${category}`)
    }
    records.forEach((record) => {
      requester.put(encrypt(record))
    })
  })
  logSync('success')
}

Promise.all([serializer.init(''), initializer.init(window.chrome)]).then((values) => {
  clientSerializer = values[0]
  const keys = values[1].keys
  const deviceId = values[1].deviceId
  clientKeys = keys
  config = values[1].config
  if (deviceId instanceof Uint8Array && deviceId.length === 1) {
    clientDeviceId = deviceId
    logSync(`initialized deviceId ${deviceId[0]}`)
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
})
  .then(() => {
    return getAWSCredentials()
  })
  .then(() => {
    logSync('successfully authenticated userId: ' + clientUserId)
    logSync('using AWS bucket: ' + requester.bucket)
    return maybeSetDeviceId()
  })
  .catch((e) => { logSync('could not register device ID: ' + e, ERROR) })
  .then(() => {
    if (clientDeviceId !== null) {
      logSync('set device ID: ' + clientDeviceId)
      startSync()
    }
  })
  .catch((e) => { logSync('could not init sync: ' + e, ERROR) })
