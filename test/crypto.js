/* global describe, it */

const assert = require('assert')
const crypto = require('../lib/crypto')

function byteArrayToString (byteArray) {
  return Array.from(byteArray).join(' ')
}

function pad (arr) {
  // Pads an array to length 24
  while (arr.length < 24) {
    arr.push(0)
  }
  return arr
}

function arrayToNonceString (arr) {
  return pad(arr).join(' ')
}

describe('getNonce', () => {
  it('gets a nonce with deviceID 0 and 0 messages', () => {
    assert.equal(arrayToNonceString([0, 1]),
      byteArrayToString(crypto.getNonce(0, 0)))
  })
  it('gets a nonce with deviceID 1 and 0 messages', () => {
    assert.equal(arrayToNonceString([1, 1]),
      byteArrayToString(crypto.getNonce(1, 0)))
  })
  it('gets a nonce with 1-byte message count', () => {
    assert.equal(arrayToNonceString([1, 1, 255]),
      byteArrayToString(crypto.getNonce(1, 255)))
  })
  it('gets nonces with multi-byte message count', () => {
    assert.equal(arrayToNonceString([2, 2, 1, 0]),
      byteArrayToString(crypto.getNonce(2, 256)))
    assert.equal(arrayToNonceString([2, 3, 1, 0, 1]),
      byteArrayToString(crypto.getNonce(2, 256 * 256 + 1)))
    assert.equal(arrayToNonceString([2, 4, 1, 0, 3, 3]),
      byteArrayToString(crypto.getNonce(2, 256 * 256 * 256 + 3 * 256 + 3)))
    assert.equal(arrayToNonceString([1, 22, 1]),
      byteArrayToString(crypto.getNonce(1, Math.pow(256, 21))))
    assert.equal(arrayToNonceString([1, 22, 1, 2]),
      byteArrayToString(crypto.getNonce(1, Math.pow(256, 21) + 2 * Math.pow(256, 20))))
  })
  it('throws if message count or device id is too high', () => {
    assert.throws(
      crypto.getNonce.bind(null, 256, 1), /Invalid device/)
    assert.throws(
      crypto.getNonce.bind(null, 1, Math.pow(256, 22)), /Nonce count/)
  })
})
