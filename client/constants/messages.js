'use strict'

const _ = null

const mapValuesByKeys = (o) =>
  Object.keys(o).reduce((newObject, k) => {
    newObject[k] = k.toLowerCase().replace(/_/g, '-')
    return newObject
  }, {})

// Messages between webview and main browser process
const messages = {
  // Crypto registration
  GET_INIT_DATA: _,
  GOT_INIT_DATA: _, /* @param {Uint8Array} seed, @param {Uint8Array} deviceId */
  SAVE_INIT_DATA: _, /* @param {Uint8Array} seed, @param {Uint8Array} deviceId */
  // Sync data
  RECEIVE_SYNC_RECORDS: _, /* @param {{bookmarks: [], historySites: [], siteSettings: []}} */
  SEND_SYNC_RECORDS: _ /* @param {{bookmarks: [], historySites: [], siteSettings: []}} */
}

module.exports = mapValuesByKeys(messages)
