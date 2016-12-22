const testHelper = require('../testHelper')

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
  const keys = crypto.deriveKeys(testHelper.cryptoSeed())
  const userId = Buffer.from(keys.publicKey).toString('base64')

  const timestamp = Math.floor(Date.now() / 1000)
  const message = timestamp.toString()
  const signedTimestamp = crypto.sign(serializer.stringToByteArray(message), keys.secretKey)

  const params = {
    method: 'POST',
    body: signedTimestamp
  }
  return window.fetch(`${serverUrl}/${userId}/credentials`, params)
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
