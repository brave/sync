// Polyfills chrome.ipc object for testing purposes. Do not use for real sync.

(function(self) {
  'use strict'

  var initCb = () => {}
  // Saved crypto seed; byteArray
  var seed = new Uint8Array([243, 203, 185, 143, 101, 184, 134, 109, 69, 166, 218, 58, 63, 155, 158, 17, 31, 184, 175, 52, 73, 80, 190, 47, 45, 12, 59, 64, 130, 13, 146, 248])
  // Saved deviceId; byteArray
  var deviceId = null
  // Fill this in using ex: server/config/default.json
  const config = {
    apiVersion: '0',
    serverUrl: 'http://localhost:4000'
  }

  if (self.chrome && self.chrome.ipcRenderer) {
    return
  }
  self.chrome = {}
  const ipc = {}
  ipc.on = (message, cb) => {
    if (message === 'got-init-data') {
      if (cb) {
        initCb = cb
      }
      initCb(null, seed, deviceId, config)
    }
  }
  ipc.send = (message, arg1, arg2) => {
    if (message === 'save-init-data') {
      seed = arg1
      deviceId = arg2
      ipc.on('got-init-data')
    }
  }
  self.chrome.ipcRenderer = ipc
})(typeof self !== 'undefined' ? self : this)

