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
    if (!chrome || !chrome.ipcRenderer) {
      reject('Browser does not support chrome.ipcRenderer')
      return
    }
    chrome.ipcRenderer.send(messages.GET_INIT_DATA)
    chrome.ipcRenderer.on(messages.GOT_INIT_DATA, (e, seed, deviceId, config) => {
      if (seed === null) {
        // Generate a new "persona"
        seed = crypto.getSeed()
        deviceId = new Uint8Array([0])
        chrome.ipcRenderer.send(messages.SAVE_INIT_DATA, seed, deviceId)
        // TODO: The background process should listen for SAVE_INIT_DATA and emit
        // GOT_INIT_DATA once the save is successful
      }
      // XXX: workaround #17
      seed = seed instanceof Array ? new Uint8Array(seed) : seed
      deviceId = deviceId instanceof Array ? new Uint8Array(deviceId) : deviceId
      if (!(seed instanceof Uint8Array) || seed.length !== crypto.SEED_SIZE) {
        reject('Invalid crypto seed')
        return
      }
      // TODO: remove this chrome.ipcRenderer listener once resolved
      resolve({keys: crypto.deriveKeys(seed), deviceId, config})
    })
  })
}
