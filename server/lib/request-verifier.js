'use strict'

const config = require('config')
const crypto = require('../../lib/crypto')
const serializer = require('../../lib/serializer.js')
const util = require('./util.js')
serializer.init()

/**
 * Check if a client's reported timestamp is within the acceptable range.
 * @param {number} timestamp
 * @returns {boolean}
 */
function validTimestamp (timestamp) {
  if (typeof timestamp !== 'number') { throw new Error('timestamp must be a number') }
  const serverTimestamp = Math.floor(Date.now() / 1000)
  const offset = Math.abs(serverTimestamp - timestamp)
  return (offset < config.clientTimestampOffsetMax)
}

/**
 * Verifies a request is signed with the correct public key.
 * For use with express app.param().
 */
module.exports = function (request, response, next, userId) {
  if (!userId) {
    util.logger.debug('<- 400; userId (pubkey) missing')
    return response.status(400).end('userId (pubkey) is required (url syntax: /:userId/{endpoint}).')
  }
  let body = Buffer.alloc(0)
  request.on('data', (chunk) => {
    const totalLength = body.length + chunk.length
    body = Buffer.concat([body, chunk], totalLength)
  }).on('end', () => {
    if (!body || body.length === 0) {
      util.logger.debug('<- 400; request body missing')
      return response.status(400).end('Signed request body is required.')
    }
    const publicKey = Buffer.from(userId, 'base64')

    let verifiedBytes = null
    try {
      verifiedBytes = crypto.verify(body, publicKey)
    } catch (e) {}
    if (!verifiedBytes) {
      util.logger.debug('<- 400; crypto verification failed.')
      return response.status(400).end('Unable to verify the signed request. Please check the signing private key matches the pubkey.')
    }

    const result = serializer.serializer.byteArrayToString(verifiedBytes)
    const timestamp = parseInt(result)

    if (!result || !timestamp || !validTimestamp(timestamp)) {
      util.logger.debug(`<- 400; malformed request. should have a timestamp in seconds, max age ${config.clientTimestampOffsetMax}. decrypted request body=${result}; timestamp=${timestamp}`)
      return response.status(400).end('Signed request body of the client timestamp is required.')
    }

    util.logger.debug(' * request verified')
    request.userId = userId
    next()
  })
}
