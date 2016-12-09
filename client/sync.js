// @flow
'use strict'

const initializer = require('./init')
const config = require('./constants/config')
const serializer = require('../lib/serializer')
const crypto = require('../lib/crypto')

window.deviceId = null
window.userId = null
window.keys = {}

var clientSerializer = null

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
  }
  if (keys.publicKey instanceof Uint8Array) {
    window.userId = window.encodeURIComponent(window.btoa(String.fromCharCode.apply(null, keys.publicKey)))
  }
  if (!window.userId || !window.keys.secretKey) {
    throw new Error('Missing userID or keys')
  }
})
  .catch((e) => { console.log('could not init sync:', e) })
  .then(() => {
    return getAWSCredentials()
  })
  .then((response) => {
    if (response.ok) {
      console.log('successfully authenticated', window.userId)
      // Do something
      Promise.resolve()
    } else {
      Promise.reject('Response code ' + response.status)
    }
  })
  .catch((e) => { console.log('could not get AWS credentials:', e) })
