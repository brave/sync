// @flow
'use strict'

const pb = require('protobufjs')

module.exports.init = function (apiFile/* : string */) {
  return pb.load(apiFile || './lib/api.proto').then((r) => {
    if (this.serializer) { return this.serializer }
    const serializer = new Serializer({
      Credentials: r.lookup('api.Credentials'),
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

/**
 * Serializes client sync credentials for accessing AWS and S3.
 * @param {{aws: {{accessKeyId: <string>, secretAccessKey: <string>, sessionToken: <string>, expiration: <string>}}}, s3Post: {{accessKeyId: <string>, secretAccessKey: <string>, sessionToken: <string>, expiration: <string>}}, bucket: <string>, region: <string>}} credentials
 * @returns {Uint8Array}
 */
Serializer.prototype.credentialsToByteArray = function (credentials) {
  return this.api.Credentials.encode({
    aws: this.api.Credentials.lookup('Aws').create(credentials.aws),
    s3Post: this.api.Credentials.lookup('S3Post').create(credentials.s3Post),
    bucket: credentials.bucket,
    region: credentials.region
  }).finish()
}

/**
 * Deserializes client sync credentials for accessing AWS and S3.
 * @param {Uint8Array} bytes
 * @returns {api.Credentials}
 */
Serializer.prototype.byteArrayToCredentials = function (bytes) {
  return this.api.Credentials.decode(bytes)
}
