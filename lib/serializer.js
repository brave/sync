// @flow
'use strict'

const utf8 = require('@protobufjs/utf8')
const syncTypes = require('./syncTypes')

module.exports.init = function () {
  return new Promise((resolve, reject) => {
    try {
      const apiProto = require('./api.proto.js')
      const serializer = new Serializer({
        Credentials: apiProto.api.Credentials,
        SecretboxRecord: apiProto.api.SecretboxRecord,
        SyncRecord: apiProto.api.SyncRecord
      })
      this.serializer = serializer
      resolve(this.serializer)
    } catch (e) {
      reject(e)
    }
  }).catch((e) => {
    throw new Error('Proto file could not be loaded.')
  })
}

module.exports.serializer = null

var Serializer = function (api) {
  this.api = api
}

/**
 * Serializes a string to a byte array
 * @param {string} msg
 * @returns {Uint8Array}
 */
Serializer.prototype.stringToByteArray = function (msg/* : string */) {
  const bytes = new Uint8Array(utf8.length(msg))
  utf8.write(msg, bytes, 0)
  return bytes
}

/**
 * Deserializes a byte array to a string
 * @param {Uint8Array} bytes
 * @returns {string}
 */
Serializer.prototype.byteArrayToString = function (bytes/* : Uint8Array */) {
  return utf8.read(bytes, 0, bytes.length)
}

/**
 * Serializes client sync credentials for accessing AWS and S3.
 * @param {{aws: {{accessKeyId: <string>, secretAccessKey: <string>, sessionToken: <string>, expiration: <string>}}}, s3Post: {{accessKeyId: <string>, secretAccessKey: <string>, sessionToken: <string>, expiration: <string>}}, bucket: <string>, region: <string>}} credentials
 * @returns {Uint8Array}
 */
Serializer.prototype.credentialsToByteArray = function (credentials) {
  return this.api.Credentials.encode({
    aws: this.api.Credentials.Aws.create(credentials.aws),
    s3Post: this.api.Credentials.S3Post.create(credentials.s3Post),
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

/**
 * Serializes a secrebox record into a byte array.
 * @param {api.SecretboxRecord} record
 * @returns {Uint8Array}
 */
Serializer.prototype.SecretboxRecordToByteArray = function (record) {
  return this.api.SecretboxRecord.encode(record).finish()
}

/**
 * Reverse of SecretboxRecordToByteArray
 * @param {Uint8Array} bytes
 * @returns {api.SecretboxRecord}
 */
Serializer.prototype.byteArrayToSecretboxRecord = function (bytes) {
  return this.api.SecretboxRecord.decode(bytes)
}

/**
 * Proto SyncRecord.objectData is stuck on 'bookmark', so this derives
 * objectData based on SyncRecord properties.
 * @param {api.SyncRecord} record
 * @returns {string}
 */
const getSyncRecordObjectData = (record/* : Object */) => {
  for (let type in syncTypes) {
    if (record[type]) {
      return type
    }
  }
}
module.exports.getSyncRecordObjectData = getSyncRecordObjectData

/**
 * Serializes a sync record into a byte array.
 * @param {api.SyncRecord} record
 * @returns {Uint8Array}
 */
Serializer.prototype.syncRecordToByteArray = function (record) {
  const type = getSyncRecordObjectData(record)
  if (!type) {
    throw new Error('Unsupported sync data type.')
  }
  const typeProps = Object.assign({}, record[type])
  typeProps.fields = Object.keys(record[type])
  return this.api.SyncRecord.encode({
    action: record.action,
    deviceId: record.deviceId,
    objectData: type,
    objectId: record.objectId,
    [type]: this.api.SyncRecord[syncTypes[type]].create(typeProps)
  }).finish()
}

/**
 * Reverse of syncRecordToByteArray
 * @param {Uint8Array} bytes
 * @returns {api.SyncRecord}
 */
Serializer.prototype.byteArrayToSyncRecord = function (bytes) {
  return this.api.SyncRecord.decode(bytes)
}
