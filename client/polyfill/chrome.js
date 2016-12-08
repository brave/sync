// Polyfills chrome.ipc object for testing purposes. Do not use for real sync.

(function(self) {
  'use strict'

  var seed = null
  var deviceId = null
  var initCb = () => {}

  if (self.chrome && self.chrome.ipc) {
    return
  }
  self.chrome = {}
  const ipc = {}
  ipc.on = (message, cb) => {
    if (message === 'got-init-data') {
      if (cb) {
        initCb = cb
      }
      initCb(null, seed, deviceId)
    }
  }
  ipc.send = (message, arg1, arg2) => {
    if (message === 'save-init-data') {
      seed = arg1
      deviceId = arg2
      ipc.on('got-init-data')
    }
  }
  self.chrome.ipc = ipc
})(typeof self !== 'undefined' ? self : this)

