'use strict'

const crypto = require('../lib/crypto')

/**
 * Create a function which will serialize then encrypt a sync record.
 * @param {Serializer} serializer
 * @param {Uint8Array} secretboxKey
 * @param {number} nonceCounter
 * @returns {Function}
 */
module.exports.Encrypt = (serializer, secretboxKey, nonceCounter) => {
  return (syncRecord) => {
    return this.encrypt(serializer, secretboxKey, syncRecord, nonceCounter)
  }
}

/**
 * Serialize then encrypt a sync record.
 * Note this is the browser JS version, so it uses Uint8Array as the main way to
 * express byte arrays.
 * @param {Serializer} serializer
 * @param {Uint8Array} secretboxKey
 * @param {Object} syncRecord
 * @param {number} nonceCounter
 * @returns {Uint8Array}
 */
module.exports.encrypt = (serializer, secretboxKey, syncRecord, nonceCounter) => {
  const bytes = serializer.syncRecordToByteArray(syncRecord)
  const nonceRandom = Buffer.from(crypto.randomBytes(20))
  const encrypted = crypto.encrypt(bytes, secretboxKey, nonceCounter, nonceRandom)
  return serializer.SecretboxRecordToByteArray({
    encryptedData: encrypted.ciphertext,
    nonceCounter,
    nonceRandom: encrypted.nonce
  })
}

/**
 * Create a function which will decrypt then deserialize a message.
 * @param {Serializer} serializer
 * @param {Uint8Array} secretboxKey
 * @returns {Function}
 */
module.exports.Decrypt = (serializer, secretboxKey) => {
  return (secretboxRecordBytes) => {
    return this.decrypt(serializer, secretboxKey, secretboxRecordBytes)
  }
}

/**
 * Decrypt then deserialize a message.
 * @param {Serializer} serializer
 * @param {Uint8Array} secretboxKey
 * @param {Uint8Array} secretboxRecordBytes
 * @returns {Object}
 */
module.exports.decrypt = (serializer, secretboxKey, secretboxRecordBytes) => {
  const secretboxRecord = serializer.byteArrayToSecretboxRecord(secretboxRecordBytes)
  const decryptedBytes = crypto.decrypt(
    secretboxRecord.encryptedData,
    secretboxRecord.nonceRandom,
    Buffer.from(secretboxKey)
  )
  return serializer.byteArrayToSyncRecord(decryptedBytes)
}

/**
 * Create a function which will sign some bytes.
 * @param {Uint8Array} secretKey
 * @returns {Function}
 */
module.exports.Sign = (secretKey) => {
  return (bytes) => {
    return crypto.sign(bytes, secretKey)
  }
}
