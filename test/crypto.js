const test = require('tape')
const crypto = require('../lib/crypto')
const {hexToUint8, uint8ToHex} = require('brave-crypto')
const serializer = require('../lib/serializer')

function init() {
  return serializer.init()
}

const toHex = uint8ToHex
const fromHex = hexToUint8

let previousNonces = []

test('randomBytes', (t) => {
  t.plan(1)
  t.equal(crypto.randomBytes(666).length, 666)
})

test('getNonce', (t) => {
  t.test('gets a nonce with counter 0', (q) => {
    q.plan(5)
    let nonce = crypto.getNonce(0, crypto.randomBytes(20))
    previousNonces.push(toHex(nonce))
    q.equal(nonce.length, 24)
    q.equal(nonce[1], 0)
    q.equal(nonce[0], 0)
    q.equal(nonce[22], 0)
    q.equal(nonce[23], 0)
  })
  t.test('gets a nonce with counter 1000', (q) => {
    q.plan(5)
    let nonce = crypto.getNonce(1000, crypto.randomBytes(20))
    previousNonces.push(toHex(nonce))
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
      let nonce = crypto.getNonce(1, crypto.randomBytes(20))
      let nonceString = toHex(nonce)
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
      crypto.getNonce.bind(null, Math.pow(256, 2), crypto.randomBytes(20)), /Invalid counter/)
  })
  t.test('throws if nonce random is not length 20', (q) => {
    q.plan(1)
    q.throws(
      crypto.getNonce.bind(null, 0, crypto.randomBytes(21)), /Invalid nonce/)
  })
})

const nonceBytes = crypto.randomBytes(20)

test('encrypt and decrypt', (t) => {
  const key = new Uint8Array([149, 180, 182, 164, 238, 114, 52, 28, 87, 253, 230, 254, 239, 174, 160, 156, 180, 174, 143, 196, 59, 87, 148, 212, 179, 123, 187, 239, 251, 38, 96, 60])
  const message = '€ are my favorite moneys'
  t.test('encrypted data has the correct length', (q) => {
    q.plan(4)
    const result = crypto.encrypt(new Uint8Array([]), key, 0, nonceBytes)
    q.equal(result.ciphertext.length, 16)
    q.equal(result.nonce.length, 24)
    const result2 = crypto.encrypt(new Uint8Array(Array(128)), key, 0, nonceBytes)
    q.equal(result2.ciphertext.length, 144)
    q.equal(result2.nonce.length, 24)
  })
  t.test('decrypts to original message', (q) => {
    q.plan(1)
    init().then((testSerializer) => {
      const bytes = testSerializer.stringToByteArray(message)
      const encrypted = crypto.encrypt(bytes, key, 0, nonceBytes)
      const decrypted = crypto.decrypt(encrypted.ciphertext, encrypted.nonce, key)
      q.equal(message, testSerializer.byteArrayToString(decrypted), 'gets original message')
    })
  })
  t.test('decryption failures', (q) => {
    q.plan(3)
    init().then((testSerializer) => {
      const encrypted = crypto.encrypt(testSerializer.stringToByteArray(message), key, 0, nonceBytes)
      q.equal(crypto.decrypt(encrypted.ciphertext, new Uint8Array(24), key), null)
      q.equal(crypto.decrypt(encrypted.ciphertext, encrypted.nonce, new Uint8Array(32)), null)
      encrypted.ciphertext[0] = 255
      q.equal(crypto.decrypt(encrypted.ciphertext, encrypted.nonce, key), null)
    })
  })
})

test('key derivation', (t) => {
  t.plan(7)
  const key = crypto.deriveKeys(fromHex("5bb5ceb168e4c8e26a1a16ed34d9fc7fe92c1481579338da362cb8d9f925d7cb"))
  t.equal('f58ca446f0c33ee7e8e9874466da442b2e764afd77ad46034bdff9e01f9b87d4', key.fingerprint, 'gets fingerprint')
  t.equal('f58ca446f0c33ee7e8e9874466da442b2e764afd77ad46034bdff9e01f9b87d4', toHex(key.publicKey), 'gets pub key')
  t.equal('b5abda6940984c5153a2ba3653f047f98dfb19e39c3e02f07c8bbb0bd8e8872ef58ca446f0c33ee7e8e9874466da442b2e764afd77ad46034bdff9e01f9b87d4', toHex(key.secretKey), 'gets priv key')
  t.equal('3f36b2accde947ab30e273f8ec0bd5a1547d31b7cf5637e1cb4885409b5da829', toHex(key.secretboxKey), 'gets secretbox key')
  t.throws(crypto.deriveKeys.bind(null, []), /Uint8Array/)
  const message = '€ 123 ッッッ　あ'
  t.test('can encrypt and decrypt with the derived key', (q) => {
    q.plan(1)
    init().then((testSerializer) => {
      const encrypted = crypto.encrypt(testSerializer.stringToByteArray(message),
        key.secretboxKey, 1, nonceBytes)
      const decrypted = crypto.decrypt(encrypted.ciphertext, encrypted.nonce,
        key.secretboxKey)
      q.equal(testSerializer.byteArrayToString(decrypted), message)
    })
  })
  t.test('can sign and verify with the derived key', (q) => {
    q.plan(4)
    // XXX: bytes is length 25 in node and 47 in browser!
    init().then((testSerializer) => {
      const bytes = testSerializer.stringToByteArray(message)
      const signed = crypto.sign(bytes, key.secretKey)
      q.equal(signed.length, bytes.length + 64)
      let verified = crypto.verify(signed, key.publicKey)
      q.equal(testSerializer.byteArrayToString(verified), message)
      // Test verification failures
      verified = crypto.verify(signed, key.secretboxKey)
      q.equal(null, verified)
      signed[0] = 255
      verified = crypto.verify(signed, key.publicKey)
      q.equal(null, verified)
    })
  })
})
