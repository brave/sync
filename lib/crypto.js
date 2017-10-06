// @flow

'use strict'

const nacl = require('tweetnacl')
const crypto = require('brave-crypto')

// Not strictly necessary but recommended by rfc5869 section 3.1
const HKDF_SALT = new Uint8Array([72, 203, 156, 43, 64, 229, 225, 127, 214, 158, 50, 29, 130, 186, 182, 207, 6, 108, 47, 254, 245, 71, 198, 109, 44, 108, 32, 193, 221, 126, 119, 143, 112, 113, 87, 184, 239, 231, 230, 234, 28, 135, 54, 42, 9, 243, 39, 30, 179, 147, 194, 211, 212, 239, 225, 52, 192, 219, 145, 40, 95, 19, 142, 98])

/**
 * Derives Ed25519 keypair and secretbox key from a seed.
 * @param {Uint8Array=} seed
 * @returns {{publicKey: <Uint8Array>, secretKey: <Uint8Array>,
 *   fingerprint: <string>, secretboxKey: <Uint8Array>}}
 */
module.exports.deriveKeys = function (seed/* : Uint8Array */) {
  seed = seed || crypto.getSeed()
  if (!(seed instanceof Uint8Array)) {
    throw new Error('Seed must be Uint8Array.')
  }
  // Derive the Ed25519 signing keypair
  const result = crypto.deriveSigningKeysFromSeed(seed, HKDF_SALT)
  // Fingerprint is the 32-byte public key as a hex string
  result.fingerprint = crypto.uint8ToHex(result.publicKey)
  // Secretbox key is the NaCl symmetric encryption/authentication key
  result.secretboxKey = crypto.getHKDF(seed, new Uint8Array([1]),
    nacl.secretbox.keyLength, HKDF_SALT)
  return result
}

/**
 * Signs a message using Ed25519 and returns the signed message.
 * This is only used for authentication by the server.
 * @param {Uint8Array} message
 * @param {Uint8Array} secretKey
 * @returns {Uint8Array}
 */
module.exports.sign = function (message/* : Uint8Array */,
  secretKey/* : Uint8Array */) {
  return nacl.sign(message, secretKey)
}

/**
 * Verifies a message using Ed25519 and returns the message without signature.
 * This is only used for authentication by the server.
 * Returns null if verification fails
 * @param {Uint8Array} message
 * @param {Uint8Array} publicKey
 * @returns {Uint8Array?}
 */
module.exports.verify = function (message/* : Uint8Array */,
  publicKey/* : Uint8Array */) {
  return nacl.sign.open(message, publicKey)
}

module.exports.randomBytes = nacl.randomBytes

/**
 * Build a 24-byte nonce for NaCl secretbox. Nonce structure is:
 * counter (2 bytes) || random (20 bytes) || padding (2 bytes)
 * @param {number} counter number between 0 and 256^2-1, increments every time
 *   interval T (TBD) to partially defend against replay attacks.
 * @param {Uint8Array} nonceBytes 20 bytes for the rest of the nonce
 * @returns {Uint8Array}
 */
module.exports.getNonce = function (counter/* : number */,
  nonceBytes/* : Uint8Array */) {
  if (typeof counter !== 'number' || counter < 0 || counter > 65535) {
    throw new Error(`Invalid counter ${counter}.`)
  }
  if (!(nonceBytes instanceof Uint8Array) || nonceBytes.length !== 20) {
    throw new Error('Invalid nonce.')
  }

  const nonce = new Uint8Array(nacl.secretbox.nonceLength)

  nonce[0] = Math.floor(counter / 256)
  nonce[1] = counter % 256
  nonce.set(nonceBytes, 2)

  return nonce
}

/**
 * Encrypts and authenticates a message using Nacl secretbox.
 * @param {Uint8Array} message
 * @param {Uint8Array} secretboxKey
 * @param {number} counter
 * @param {Uint8Array} nonceBytes
 * @returns {{nonce: <Uint8Array>, ciphertext: <Uint8Array>}}
 */
module.exports.encrypt = function (message/* : Uint8Array */,
  secretboxKey/* : Uint8Array */, counter/* : number */,
  nonceBytes/* : Uint8Array */) {
  const nonce = module.exports.getNonce(counter, nonceBytes)
  return {
    nonce,
    ciphertext: nacl.secretbox(message, nonce, secretboxKey)
  }
}

/**
 * Decrypts and verifies a message using Nacl secretbox. Returns null if
 * verification fails.
 * @param {Uint8Array} ciphertext
 * @param {Uint8Array} nonce
 * @param {Uint8Array} secretboxKey
 * @returns {Uint8Array?}
 */
module.exports.decrypt = function (ciphertext/* : Uint8Array */,
  nonce/* : Uint8Array */, secretboxKey/* : Uint8Array */) {
  return nacl.secretbox.open(ciphertext, nonce, secretboxKey)
}
