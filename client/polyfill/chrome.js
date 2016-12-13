// Polyfills chrome.ipc object for testing purposes. Do not use for real sync.

(function(self) {
  'use strict'

  var initCb = () => {}
  // Saved crypto seed; byteArray
  var seed = null
  // Saved deviceId; byteArray
  var deviceId = null
  // Fill this in using ex: server/config/default.json
  const config = {
    apiVersion: 0,
    serverUrl: 'https://sync-staging.brave.com',
    awsRegion: 'us-west-2' // TODO: API server should return this
  }

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
  self.chrome.ipc = ipc
})(typeof self !== 'undefined' ? self : this)

