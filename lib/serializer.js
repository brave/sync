// @flow
'use strict'

const pb = require('protobufjs')

module.exports.init = function (apiFile/* : string */) {
  return pb.load(apiFile || './lib/api.proto').then((r) => {
    return new Serializer({
      GenericMessage: r.lookup('api.GenericMessage'),
      SecretBoxRecord: r.lookup('api.SecretBoxRecord'),
      SyncRecord: r.lookup('api.SyncRecord')
    })
  }).catch((e) => {
    throw new Error('Proto file could not be loaded.')
  })
}

var Serializer = function (api) {
  this.api = api
}

/**
 * Serializes a string to a byte array, mostly for testing
 * @param {string} msg
 * @returns {Uint8Array}
 */
Serializer.prototype.stringToByteArray = function (msg/* : string */) {
  return this.api.GenericMessage.encode({
    message: msg
  }).finish()
}

/**
 * Deserializes a byte array to a string, mostly for testing
 * @param {Uint8Array} bytes
 * @returns {string}
 */
Serializer.prototype.byteArrayToString = function (bytes/* : Uint8Array */) {
  return this.api.GenericMessage.decode(bytes).message
}

module.exports.serializer = null

module.exports.initSerializer = function (apiFile/* : string */) {
  return new Promise((resolve, reject) => {
    if (this.serializer) { resolve(this.serializer) }
    this.init(apiFile).then((serializer) => {
      this.serializer = serializer
      resolve(serializer)
    }).catch((error) => { reject(error) })
  })
}
