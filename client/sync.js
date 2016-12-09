'use strict'

const initializer = require('./init')
const config = require('./constants/config')
const serializer = require('../lib/serializer')
const crypto = require('../lib/crypto')

// logging
const DEBUG = 0
const WARN = 1
const ERROR = 2
const logElement = document.querySelector('#output')

var clientSerializer = null
var clientDeviceId = null
var clientUserId = null
var clientKeys = {}

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
 * Gets AWS creds.
 * @returns {Promise}
 */
const getAWSCredentials = () => {
  const serverUrl = config.serverOrigin
  const now = Math.floor(Date.now() / 1000).toString()
  if (clientSerializer === null) {
    throw new Error('Serializer not initialized.')
  }
  const request = new window.Request(`${serverUrl}/${clientUserId}/credentials`, {
    method: 'POST',
    body: crypto.sign(clientSerializer.stringToByteArray(now), clientKeys.secretKey)
  })
  return window.fetch(request)
}

/**
 * Sets the device ID if one does not yet exist.
 * @returns {Promise}
 */
const maybeSetDeviceId = () => {
  if (clientDeviceId !== null) {
    return
  }
}

/**
 * Starts the sync process.
 */
const startSync = () => {
}

Promise.all([serializer.init(''), initializer.init(window.chrome)]).then((values) => {
  clientSerializer = values[0]
  const keys = values[1].keys
  const deviceId = values[1].deviceId
  clientKeys = keys
  if (deviceId instanceof Uint8Array && deviceId.length === 1) {
    clientDeviceId = deviceId
    logSync(`initialized deviceId ${deviceId[0]}`)
  }
  if (keys.publicKey instanceof Uint8Array) {
    clientUserId = window.encodeURIComponent(window.btoa(String.fromCharCode.apply(null, keys.publicKey)))
  }
  if (!clientUserId || !clientKeys.secretKey) {
    throw new Error('Missing userID or keys')
  }
  logSync(`initialized userId ${clientUserId}`)
})
  .catch((e) => { logSync('could not init sync: ' + e, ERROR) })
  .then(() => {
    return getAWSCredentials()
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('server response ' + response.status)
    }
  })
  .catch((e) => { logSync('could not get AWS credentials: ' + e, ERROR) })
  .then(() => {
    logSync('successfully authenticated userId ' + clientUserId)
    return maybeSetDeviceId()
  })
  .catch((e) => { logSync('could not register device ID ' + e, ERROR) })
  .then(() => {
    startSync()
  })
