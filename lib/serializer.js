// @flow
'use strict'

const pb = require('protobufjs')

module.exports.init = function () {
  return pb.load('./lib/api.proto').then((r) => {
    return new Serializer({
      GenericMessage: r.lookup('api.GenericMessage')
    })
  })
  .catch((err) => {
    console.log('Error loading api.proto')
    return err
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
