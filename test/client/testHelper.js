/**
 * clientConfig for running browser JS tests because node-config
 * has issues browserifying.
 * @returns {{
 *   apiVersion: <string>
 * }}
 */
const CONFIG = {
  apiVersion: '0',
  serverUrl: 'http://localhost:4000'
}
module.exports.CONFIG = CONFIG

/**
 * For testing recovery from expired credentials.
 */
const EXPIRED_CREDENTIALS = {
  aws: {
    accessKeyId: 'ASIAJWDZEARJIRDPKHCA',
    secretAccessKey: 'UWE6jt/VTgvyr9s1A8cGgQJKRZgpnSrFfNtbbVGQ',
    sessionToken: 'FQoDYXdzEPj//////////wEaDMcXJlV2DDdqPcV6tSKjA6DuDSolA5d1kxuuZiCbxPjR439unlaxtIIHLe/NCI9EbhxX2sRYW5ke244fobOYIgnyO9+cm28sqZdewM4LvYYgYwivwc3Ud9zmDzW14ZtJUSVXbj4WU0XHH106bV7RpQ52fTnG55sNfdhWndY1ptHBQzifWa3aKhGGQ4gpDPa+lGb5VaSlgMXqutzn8nVXA801MmwZXbfcT7QjloP8Qio4hnVQQptXfTlXoNsjPdmu7N8ZEUrnwZ4UmHIt4xbZ8GsM2YYBbuCroQjsvsc03eBhJ4HcAcx6G8W3pUDl8D0JbbgEEtwjwSHLJQ2tpUp8GKXPryp7NnU3HGAdgXWYZUY5AncXBySEZwF2PqjSuj3DuMQUuTURtvbbehKypFQ6ogAQb2OX7pzn8o/WnI/m7MS5rsIi9w0QdePzg6zGh4PtcHG4mpSqTbqsga6OQYLFW1d2DnS8hOz2h3cav3nmIF42r1/rLeiuqefUcwuVu6L9MCV7hw99rzUAOqQdKx8eh1bKU+lK1x3aypB2eLRicPyhOy3mUPs4JaDrqNnfwkViclN0KM3d0cIF',
    expiration: '2016-12-25T04:20:00Z' // <Date>.toJSON()
  },
  s3Post: {
    AWSAccessKeyId: 'AKIAIBFRINGWH5WYZLLQ',
    policy: 'eyAiZXhwaXJhdGlvbiI6ICIyMDE2LTEyLTI4VDA1OjQ4OjE2LjE2NVoiLCAiY29uZGl0aW9ucyI6IFsgeyJidWNrZXQiOiAiYnJhdmUtc3luYy10ZXN0In0sIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICIwL2ppcndzWjUxNFE0NUxZUVFZZ3lFNVJJVDBQNWRxWnVTc0ZVcWNMZ1c3Y289Il0sIHsiYWNsIjogInByaXZhdGUifSwgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDBdIF0gfQ==',
    signature: 'y3Ow85qyiEq51hFx9IfG8k7G2ik=',
    acl: 'private'
  }
}
module.exports.EXPIRED_CREDENTIALS = EXPIRED_CREDENTIALS

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

  console.log(`Connecting to ${CONFIG.serverUrl}`)
  const keys = crypto.deriveKeys()
  const userId = Buffer.from(keys.publicKey).toString('base64')

  const timestamp = Math.floor(Date.now() / 1000)
  const message = timestamp.toString()
  const signedTimestamp = crypto.sign(serializer.stringToByteArray(message), keys.secretKey)

  const params = {
    method: 'POST',
    body: signedTimestamp
  }
  return window.fetch(`${CONFIG.serverUrl}/${encodeURIComponent(userId)}/credentials`, params)
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
