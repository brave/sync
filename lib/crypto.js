// @flow

'use strict'

const nacl = require('tweetnacl')

// Length in bytes of random seed that is synced between devices
const SEED_SIZE = 32

// Not strictly necessary but recommended by rfc5869 section 3.1
const HKDF_SALT = new Uint8Array([72, 203, 156, 43, 64, 229, 225, 127, 214, 158, 50, 29, 130, 186, 182, 207, 6, 108, 47, 254, 245, 71, 198, 109, 44, 108, 32, 193, 221, 126, 119, 143, 112, 113, 87, 184, 239, 231, 230, 234, 28, 135, 54, 42, 9, 243, 39, 30, 179, 147, 194, 211, 212, 239, 225, 52, 192, 219, 145, 40, 95, 19, 142, 98])

module.exports.SEED_SIZE = SEED_SIZE

/**
 * Implementation of HMAC SHA512 from https://github.com/dchest/tweetnacl-auth-js
 * @param {Uint8Array} message
 * @param {Uint8Array} key
 * @returns {Uint8Array}
 */
module.exports.hmac = function (message/* : Uint8Array */, key/* : Uint8Array */) {
  if (!(message instanceof Uint8Array) || !(key instanceof Uint8Array)) {
    throw new Error('Inputs must be Uint8Arrays.')
  }

  const BLOCK_SIZE = 128
  const HASH_SIZE = 64
  const buf = new Uint8Array(BLOCK_SIZE + Math.max(HASH_SIZE, message.length))
  var i, innerHash

  if (key.length > BLOCK_SIZE) {
    key = nacl.hash(key)
  }

  for (i = 0; i < BLOCK_SIZE; i++) buf[i] = 0x36
  for (i = 0; i < key.length; i++) buf[i] ^= key[i]
  buf.set(message, BLOCK_SIZE)
  innerHash = nacl.hash(buf.subarray(0, BLOCK_SIZE + message.length))

  for (i = 0; i < BLOCK_SIZE; i++) buf[i] = 0x5c
  for (i = 0; i < key.length; i++) buf[i] ^= key[i]
  buf.set(innerHash, BLOCK_SIZE)
  return nacl.hash(buf.subarray(0, BLOCK_SIZE + innerHash.length))
}

/**
 * Returns HKDF output according to rfc5869 using sha512
 * @param {Uint8Array} ikm input keying material
 * @param {Uint8Array} info context-specific info
 * @param {number} extractLength length of extracted output keying material in
 *   octets
 * @param {Uint8Array=} salt optional salt
 * @returns {Uint8Array}
 */
module.exports.getHKDF = function (ikm/* : Uint8Array */, info/* : Uint8Array */,
  extractLen, salt/* : Uint8Array */) {
  const hashLength = 512 / 8

  if (typeof extractLen !== 'number' || extractLen < 0 ||
    extractLen > hashLength * 255) {
    throw Error('Invalid extract length.')
  }

  // Extract
  if (!(salt instanceof Uint8Array) || salt.length === 0) {
    salt = new Uint8Array(hashLength)
  }
  var prk = module.exports.hmac(ikm, salt) // Pseudorandom Key

  // Expand
  var n = Math.ceil(extractLen / hashLength)
  var t = []
  t[0] = new Uint8Array()
  info = info || new Uint8Array()
  var okm = new Uint8Array(extractLen)

  let filled = 0
  for (var i = 1; i <= n; i++) {
    let prev = t[i - 1]
    let input = new Uint8Array(info.length + prev.length + 1)
    input.set(prev)
    input.set(info, prev.length)
    input.set(new Uint8Array([i]), prev.length + info.length)
    let output = module.exports.hmac(input, prk)
    t[i] = output

    let remaining = extractLen - filled
    if (remaining === 0) {
      return okm
    } else if (output.length <= remaining) {
      okm.set(output, filled)
      filled = filled + output.length
    } else {
      okm.set(output.slice(0, remaining), filled)
      return okm
    }
  }
}

/**
 * Generates a random seed.
 * @returns {Uint8Array}
 */
module.exports.getSeed = function () {
  return nacl.randomBytes(SEED_SIZE)
}

/**
 * Derives Ed25519 keypair and secretbox key from a seed.
 * @param {Uint8Array} seed
 * @returns {{publicKey: <Uint8Array>, secretKey: <Uint8Array>,
 *   fingerprint: <string>, secretboxKey: <Uint8Array>}}
 */
module.exports.deriveKeys = function (seed/* : Uint8Array */) {
  if (!(seed instanceof Uint8Array)) {
    throw new Error('Seed must be Uint8Array.')
  }
  // Derive the Ed25519 signing keypair
  const output = module.exports.getHKDF(seed, new Uint8Array([0]),
    nacl.sign.seedLength, HKDF_SALT)
  const result = nacl.sign.keyPair.fromSeed(output)
  // Fingerprint is the 32-byte public key as a hex string
  result.fingerprint = ''
  result.publicKey.forEach((byte) => {
    let char = byte.toString(16)
    if (char.length === 1) {
      char = '0' + char
    }
    result.fingerprint += char
  })
  // Secretbox key is the NaCl symmetric encryption/authentication key
  result.secretboxKey = module.exports.getHKDF(seed, new Uint8Array([1]),
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
 * @param {Uint8Array} message
 * @param {Uint8Array} publicKey
 * @returns {Uint8Array}
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
 * Decrypts and verifies a message using Nacl secretbox. Returns false if
 * verification fails.
 * @param {Uint8Array} ciphertext
 * @param {Uint8Array} nonce
 * @param {Uint8Array} secretboxKey
 * @returns {Uint8Array|boolean}
 */
module.exports.decrypt = function (ciphertext/* : Uint8Array */,
  nonce/* : Uint8Array */, secretboxKey/* : Uint8Array */) {
  return nacl.secretbox.open(ciphertext, nonce, secretboxKey)
}
