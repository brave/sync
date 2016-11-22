const test = require('tape')
const crypto = require('../lib/crypto')
const serializer = require('../lib/serializer')

function byteArrayToString (byteArray) {
  return byteArray.join(' ')
}

let previousNonces = []

test('getNonce', (t) => {
  t.test('gets a nonce with counter 0', (q) => {
    q.plan(5)
    let nonce = crypto.getNonce(0)
    previousNonces.push(byteArrayToString(nonce))
    q.equal(nonce.length, 24)
    q.equal(nonce[1], 0)
    q.equal(nonce[0], 0)
    q.equal(nonce[22], 0)
    q.equal(nonce[23], 0)
  })
  t.test('gets a nonce with counter 1000', (q) => {
    q.plan(5)
    let nonce = crypto.getNonce(1000)
    previousNonces.push(byteArrayToString(nonce))
    q.equal(nonce.length, 24)
    q.equal(nonce[1], 232)
    q.equal(nonce[0], 3)
    q.equal(nonce[22], 0)
    q.equal(nonce[23], 0)
  })
  t.test('does not repeat nonces', (q) => {
    q.plan(500)
    var i = 0
    while (i < 100) {
      i++
      let nonce = crypto.getNonce(1)
      let nonceString = byteArrayToString(nonce)
      q.equal(nonce[1], 1)
      q.equal(nonce[0], 0)
      q.equal(nonce[22], 0)
      q.equal(nonce[23], 0)
      q.ok(!previousNonces.includes(nonceString))
      previousNonces.push(nonceString)
    }
  })
  t.test('throws if counter is too high', (q) => {
    q.plan(1)
    q.throws(
      crypto.getNonce.bind(null, Math.pow(256, 2)), /Invalid counter/)
  })
})

test('encrypt and decrypt', (t) => {
  const key = new Uint8Array([149, 180, 182, 164, 238, 114, 52, 28, 87, 253, 230, 254, 239, 174, 160, 156, 180, 174, 143, 196, 59, 87, 148, 212, 179, 123, 187, 239, 251, 38, 96, 60])
  const message = '€ are my favorite moneys'
  t.test('encrypted data has the correct length', (q) => {
    q.plan(4)
    const result = crypto.encrypt(new Uint8Array([]), key, 0)
    q.equal(result.ciphertext.length, 16)
    q.equal(result.nonce.length, 24)
    const result2 = crypto.encrypt(new Uint8Array(Array(128)), key, 0)
    q.equal(result2.ciphertext.length, 144)
    q.equal(result2.nonce.length, 24)
  })
  t.test('decrypts to original message', (q) => {
    q.plan(1)
    const encrypted = crypto.encrypt(serializer.stringToByteArray(message), key, 0)
    const decrypted = crypto.decrypt(encrypted.ciphertext, encrypted.nonce, key)
    q.equal(message, serializer.byteArrayToString(decrypted))
  })
})
