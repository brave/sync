/* global describe, it */

const assert = require('assert')
const crypto = require('../lib/crypto')

function byteArrayToString (byteArray) {
  return byteArray.join(' ')
}

const zeroes = '0 0 0 0 0 0 0 0 0 0 0 0 0'

let previousNonces = []

describe('getNonce', () => {
  it('gets a nonce with deviceID 0', () => {
    let nonce = crypto.getNonce(0)
    previousNonces.push(byteArrayToString(nonce))
    assert.equal(nonce.length, 24)
    assert.equal(nonce[0], 0)
    assert.equal(nonce[5], 1)
    assert(nonce[6] > 87)
    assert.equal(zeroes, byteArrayToString(nonce.slice(11)))
  })
  it('gets a nonce with deviceID 244', () => {
    let nonce = crypto.getNonce(244)
    previousNonces.push(byteArrayToString(nonce))
    assert.equal(nonce.length, 24)
    assert.equal(nonce[0], 244)
    assert.equal(nonce[5], 1)
    assert(nonce[6] > 87)
    assert.equal(zeroes, byteArrayToString(nonce.slice(11)))
  })
  it('does not repeat nonces', () => {
    var i = 0
    while (i < 100) {
      i++
      let nonce = crypto.getNonce(1)
      assert.equal(nonce[0], 1)
      assert.equal(nonce[5], 1)
      assert(nonce[6] > 87)
      assert.equal(zeroes, byteArrayToString(nonce.slice(11)))
      assert(!previousNonces.includes(byteArrayToString(nonce)))
    }
  })
  it('throws if device id is too high', () => {
    assert.throws(
      crypto.getNonce.bind(null, 256, 1), /Invalid device/)
  })
})

describe('encrypt and decrypt', () => {
  const key = new Uint8Array([149, 180, 182, 164, 238, 114, 52, 28, 87, 253, 230, 254, 239, 174, 160, 156, 180, 174, 143, 196, 59, 87, 148, 212, 179, 123, 187, 239, 251, 38, 96, 60])
  const message = '€ are my favorite moneys'
  it('encrypted data has the correct length', () => {
    const result = crypto.encrypt(new Uint8Array([]), key, 0)
    assert.equal(result.ciphertext.length, 16)
    assert.equal(result.nonce.length, 24)
    const result2 = crypto.encrypt(new Uint8Array(Array(128)), key, 0)
    assert.equal(result2.ciphertext.length, 144)
    assert.equal(result2.nonce.length, 24)
  })
  it('encodes and decodes between byte array and string', () => {
    assert.equal(message, crypto.byteArrayToString(crypto.stringToByteArray(message)))
  })
  it('decrypts to original message', () => {
    const encrypted = crypto.encrypt(crypto.stringToByteArray(message), key, 0)
    const decrypted = crypto.decrypt(encrypted.ciphertext, encrypted.nonce, key)
    assert.equal(crypto.stringToByteArray(message).join(' '), decrypted.join(' '))
  })
})
