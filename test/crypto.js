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
      console.log('got nonce', byteArrayToString(nonce))
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
