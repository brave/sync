// @flow
'use strict'

const pb = require('protobufjs')

var Wrapper = function () {
  this.init()
}

Wrapper.prototype.init = function () {
  pb.load('./lib/api.proto')
    .then((r) => {
      this.GenericMessage = r.lookup('api.GenericMessage')
    })
    .catch((err) => {
      console.log('Error loading api.proto', err)
    })
}

/**
 * Serializes a string to a byte array, mostly for testing
 * @param {string} msg
 * @returns {Uint8Array}
 */
Wrapper.prototype.stringToByteArray = function (msg/* : string */) {
  return this.GenericMessage.encode({
    message: msg
  }).finish()
}

/**
 * Deserializes a byte array to a string, mostly for testing
 * @param {Uint8Array} bytes
 * @returns {string}
 */
Wrapper.prototype.byteArrayToString = function (bytes/* : Uint8Array */) {
  return this.GenericMessage.decode(bytes).message
}

module.exports = new Wrapper()
