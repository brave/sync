/**
 * clientConfig for running browser JS tests because node-config
 * has issues browserifying.
 * @returns {{
 *   apiVersion: <string>
 * }}
 */
module.exports.config = {
  apiVersion: '0'
}

/**
 * This is the browser JS version, wherein protobuf js records which take
 * bytes can use Uint8Array.
 * For the nodejs version, see ../testHelper.js.
 * We could also combine these by using the library BytesBuffer.
 */
module.exports.encrypt = (serializer, secretboxKey, record) => {
  const crypto = require('../../lib/crypto')

  const bytes = serializer.syncRecordToByteArray(record)
  const nonceRandom = Buffer.from(crypto.randomBytes(20))
  const counter = 0
  const encrypted = crypto.encrypt(bytes, secretboxKey, counter, nonceRandom)
  return serializer.SecretboxRecordToByteArray({
    encryptedData: encrypted.ciphertext,
    counter,
    nonceRandom: encrypted.nonce
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
 * Generates keys and temporary AWS credentials.
 * Promise resolves with:
 * {{
 *   keys: {{publicKey: <Uint8Array>, secretKey: <Uint8Array>,
 *   fingerprint: <string>, secretboxKey: <Uint8Array>}},
 *   userId: <string>,
 *   serializedCredentials: <Uint8Array>
 * }}
 * @param {Serializer}
 * @returns {Promise}
 */
module.exports.getSerializedCredentials = (serializer) => {
  const crypto = require('../../lib/crypto')

  const serverUrl = `http://localhost:4000`
  console.log(`Connecting to ${serverUrl}`)
  const keys = crypto.deriveKeys(crypto.getSeed())
  const userId = Buffer.from(keys.publicKey).toString('base64')

  const timestamp = Math.floor(Date.now() / 1000)
  const message = timestamp.toString()
  const signedTimestamp = crypto.sign(serializer.stringToByteArray(message), keys.secretKey)

  const params = {
    method: 'POST',
    body: signedTimestamp
  }
  return window.fetch(`${serverUrl}/${encodeURIComponent(userId)}/credentials`, params)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Credential server response ' + response.status)
      }
      return response.arrayBuffer()
    })
    .then((credentialsArrayBuffer) => {
      const serializedCredentials = new Uint8Array(credentialsArrayBuffer)
      return {keys, userId, serializedCredentials}
    })
}
