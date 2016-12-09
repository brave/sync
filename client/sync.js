'use strict'

const initializer = require('./init')
const config = require('./constants/config')
const serializer = require('../lib/serializer')
const crypto = require('../lib/crypto')

window.deviceId = null
window.userId = null
window.keys = {}

// logging
const DEBUG = 0
const WARN = 1
const ERROR = 2
const logElement = document.querySelector('#output')

var clientSerializer = null

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
  const request = new window.Request(`${serverUrl}/${window.userId}/credentials`, {
    method: 'POST',
    body: crypto.sign(clientSerializer.stringToByteArray(now), window.keys.secretKey)
  })
  return window.fetch(request)
}

Promise.all([serializer.init(''), initializer.init(window.chrome)]).then((values) => {
  clientSerializer = values[0]
  const keys = values[1].keys
  const deviceId = values[1].deviceId
  window.keys = keys
  if (deviceId instanceof Uint8Array && deviceId.length === 1) {
    window.deviceId = deviceId
    logSync(`initialized deviceId ${deviceId[0]}`)
  }
  if (keys.publicKey instanceof Uint8Array) {
    window.userId = window.encodeURIComponent(window.btoa(String.fromCharCode.apply(null, keys.publicKey)))
  }
  if (!window.userId || !window.keys.secretKey) {
    throw new Error('Missing userID or keys')
  }
  logSync(`initialized userId ${window.userId}`)
})
  .catch((e) => { logSync('could not init sync: ' + e, ERROR) })
  .then(() => {
    return getAWSCredentials()
  })
  .then((response) => {
    if (response.ok) {
      logSync('successfully authenticated userId ' + window.userId)
      // Do something
      Promise.resolve()
    } else {
      Promise.reject('Response code ' + response.status)
    }
  })
  .catch((e) => { logSync('could not get AWS credentials: ' + e, ERROR) })
