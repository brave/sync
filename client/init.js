// @flow
'use strict'

const crypto = require('../lib/crypto')
const messages = require('./constants/messages')

/**
 * Initializes crypto and device ID
 * @param {Object} chrome window.chrome object or stub
 * @returns {Promise}
 */
module.exports.init = function (chrome/* : Object */) {
  return new Promise((resolve, reject) => {
    if (!chrome || !chrome.ipc) {
      reject('Browser does not support chrome.ipc')
      return
    }
    chrome.ipc.send(messages.GET_INIT_DATA)
    chrome.ipc.on(messages.GOT_INIT_DATA, (e, seed, deviceId, config) => {
      if (seed === null) {
        // Generate a new "persona"
        seed = crypto.getSeed()
        deviceId = new Uint8Array([0])
        chrome.ipc.send(messages.SAVE_INIT_DATA, seed, deviceId)
        // XXX: The background process must listen for SAVE_INIT_DATA and emit
        // GOT_INIT_DATA once the save is successful
        return
      }
      if (!(seed instanceof Uint8Array) || seed.length !== crypto.SEED_SIZE) {
        reject('Invalid crypto seed')
      }
      resolve({keys: crypto.deriveKeys(seed), deviceId, config})
    })
  })
}

/**
 * Gets/sets the device ID
 * @param {Object} chrome window.chrome object or stub
 */
module.exports.getDeviceId = function (chrome/* : Object */) {
  // TODO
}
