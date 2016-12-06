// @flow
'use strict'

const pb = require('protobufjs')

module.exports.init = function (apiFile/* : string */) {
  return pb.load(apiFile || './lib/api.proto').then((r) => {
    if (this.serializer) { return this.serializer }
    const serializer = new Serializer({
      GenericMessage: r.lookup('api.GenericMessage'),
      SecretBoxRecord: r.lookup('api.SecretBoxRecord'),
      SyncRecord: r.lookup('api.SyncRecord')
    })
    this.serializer = serializer
    return serializer
  }).catch((e) => {
    throw new Error('Proto file could not be loaded.')
  })
}

module.exports.serializer = null

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
