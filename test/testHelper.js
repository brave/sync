// This file contains useful helper functions to make writing tests more fun!

/**
 * A deterministic seed
 * @returns {Uint8Array}
 */
module.exports.cryptoSeed = () => {
  return new Uint8Array([243, 203, 185, 143, 101, 184, 134, 109, 69, 166, 218, 58, 63, 155, 158, 17, 31, 184, 175, 52, 73, 80, 190, 47, 45, 12, 59, 64, 130, 13, 146, 248])
}

/**
 * A deterministic uuid
 * @returns {Uint8Array}
 */
module.exports.uuid = () => {
  return new Uint8Array([109, 49, 40, 171, 234, 79, 65, 164, 137, 22, 121, 110, 244, 92, 5, 63])
}

/**
 * A random uuid
 * @returns {Uint8Array}
 */
module.exports.newUuid = () => {
  const crypto = require('../lib/crypto')
  return new Uint8Array(crypto.randomBytes(16))
}

/**
 * This is the node.js version, wherein protobuf js records which take
 * bytes require Buffer.
 * For the browser version, see client/testHelper.js.
 * We could also combine these by using the library BytesBuffer.
 */
module.exports.encrypt = (serializer, secretboxKey, record) => {
  const crypto = require('../lib/crypto')

  const bufferizedRecord = deepBufferize(record)
  const bytes = serializer.syncRecordToByteArray(bufferizedRecord)
  const nonceRandom = Buffer.from(crypto.randomBytes(20))
  const counter = 0
  const encrypted = crypto.encrypt(bytes, secretboxKey, counter, nonceRandom)
  return serializer.SecretboxRecordToByteArray({
    encryptedData: Buffer.from(encrypted.ciphertext),
    counter,
    nonceRandom: Buffer.from(encrypted.nonce)
  })
}

/**
 * Convenience wrapper.
 */
module.exports.Encrypt = (serializer, secretboxKey) => {
  return (record) => {
    return this.encrypt(serializer, secretboxKey, record)
  }
}

/**
 * Convenience wrapper.
 */
module.exports.Decrypt = (serializer, secretboxKey) => {
  const crypto = require('../lib/crypto')
  return (secretboxRecordBytes) => {
    const secretboxRecord = serializer.byteArrayToSecretboxRecord(secretboxRecordBytes)
    const decryptedBytes = crypto.decrypt(
      secretboxRecord.encryptedData,
      secretboxRecord.nonceRandom,
      Buffer.from(secretboxKey)
    )
    return serializer.byteArrayToSyncRecord(decryptedBytes)
  }
}

/**
 * Copy an object and deep modify the copy to turn Uint8Array into Buffer.
 */
const deepBufferize = (sourceObject) => {
  let object = Object.assign({}, sourceObject)
  const has = Object.prototype.hasOwnProperty.bind(object)
  for (let k in object) {
    if (!has(k)) { continue }
    if (object[k] instanceof Uint8Array) {
      object[k] = Buffer.from(object[k])
    } else if (typeof object[k] === 'object') {
      object[k] = deepBufferize(Object.assign({}, object[k]))
    }
  }
  return object
}
