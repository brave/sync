const test = require('tape')
const crypto = require('../lib/crypto')
const serializer = require('../lib/serializer')

function init() {
  return serializer.init()
}

function toHex (byteArray) {
  var str = ''
  for (var i = 0; i < byteArray.length; i++) {
    let char = byteArray[i].toString(16)
    if (char.length === 1) {
      char = '0' + char
    }
    str = str + char
  }
  return str
}

function fromHex (hexString) {
  if (typeof hexString !== 'string') {
    return
  }
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString
  }
  const arr = new Uint8Array(hexString.length / 2)
  for (var i = 0; i < hexString.length / 2; i++) {
    arr[i] = Number('0x' + hexString[2 * i] + hexString[2 * i + 1])
  }
  return arr
}

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

test('hmac', (t) => {
  // https://tools.ietf.org/html/rfc4231#section-4
  const keys = [
    '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
    '4a656665',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    '0102030405060708090a0b0c0d0e0f10111213141516171819',
    '0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  ]
  const data = [
    '4869205468657265',
    '7768617420646f2079612077616e7420666f72206e6f7468696e673f',
    'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
    'cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd',
    '546573742057697468205472756e636174696f6e',
    '54657374205573696e67204c6172676572205468616e20426c6f636b2d53697a65204b6579202d2048617368204b6579204669727374',
    '5468697320697320612074657374207573696e672061206c6172676572207468616e20626c6f636b2d73697a65206b657920616e642061206c6172676572207468616e20626c6f636b2d73697a6520646174612e20546865206b6579206e6565647320746f20626520686173686564206265666f7265206265696e6720757365642062792074686520484d414320616c676f726974686d2e'
  ]
  const outputs = [
    '87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854',
    '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737',
    'fa73b0089d56a284efb0f0756c890be9b1b5dbdd8ee81a3655f83e33b2279d39bf3e848279a722c806b485a47e67c807b946a337bee8942674278859e13292fb',
    'b0ba465637458c6990e5a8c5f61d4af7e576d97ff94b872de76f8050361ee3dba91ca5c11aa25eb4d679275cc5788063a5f19741120c4f2de2adebeb10a298dd',
    '415fad6271580a531d4179bc891d87a6',
    '80b24263c7c1a3ebb71493c1dd7be8b49b46d1f41b4aeec1121b013783f8f3526b56d037e05f2598bd0fd2215d6a1e5295e64f73f63f0aec8b915a985d786598',
    'e37b6a775dc87dbaa4dfa9f96e5e3ffddebd71f8867289865df5a32d20cdc944b6022cac3c4982b10d5eeb55c3e4de15134676fb6de0446065c97440fa8c6a58'
  ]
  t.plan(8)
  outputs.forEach((output, i) => {
    if (i === 4) {
      // test case 5 tests truncation to 128 bits
      t.ok(toHex(crypto.hmac(fromHex(data[i]), fromHex(keys[i]))).startsWith(output))
      return
    }
    t.equal(output, toHex(crypto.hmac(fromHex(data[i]), fromHex(keys[i]))))
  })
  t.throws(crypto.hmac.bind(null, new Uint8Array(), []), /Uint8Arrays/, 'errors if inputs are wrong type')
})

test('hkdf', (t) => {
  // https://www.kullo.net/blog/hkdf-sha-512-test-vectors/
  var results = [{
    "IKM"   : "0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b",
    "salt"  : "000102030405060708090a0b0c",
    "info"  : "f0f1f2f3f4f5f6f7f8f9",
    "L"     : 42,
    "OKM"   : "832390086cda71fb47625bb5ceb168e4c8e26a1a16ed34d9fc7fe92c1481579338da362cb8d9f925d7cb"
  }, {
    "IKM"   : "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f",
    "salt"  : "606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeaf",
    "info"  : "b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff",
    "L"     : 82,
    "OKM"   : "ce6c97192805b346e6161e821ed165673b84f400a2b514b2fe23d84cd189ddf1b695b48cbd1c8388441137b3ce28f16aa64ba33ba466b24df6cfcb021ecff235f6a2056ce3af1de44d572097a8505d9e7a93"
  }, {
    "IKM"   : "0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b",
    "salt"  : "",
    "info"  : "",
    "L"     : 42,
    "OKM"   : "f5fa02b18298a72a8c23898a8703472c6eb179dc204c03425c970e3b164bf90fff22d04836d0e2343bac"
  }, {
    "IKM"   : "0b0b0b0b0b0b0b0b0b0b0b",
    "salt"  : "000102030405060708090a0b0c",
    "info"  : "f0f1f2f3f4f5f6f7f8f9",
    "L"     : 42,
    "OKM"   : "7413e8997e020610fbf6823f2ce14bff01875db1ca55f68cfcf3954dc8aff53559bd5e3028b080f7c068"
  }, {
    "IKM"   : "0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c",
    "info"  : "",
    "L"     : 42,
    "OKM"   : "1407d46013d98bc6decefcfee55f0f90b0c7f63d68eb1a80eaf07e953cfc0a3a5240a155d6e4daa965bb"
  }]
  t.plan(6)
  results.forEach((result) => {
    var hkdf = crypto.getHKDF(
      fromHex(result['IKM']),
      fromHex(result['info']),
      result['L'],
      fromHex(result['salt'])
    )
    t.equal(toHex(hkdf), result['OKM'])
  })
  t.throws(crypto.getHKDF.bind(null, new Uint8Array(1), new Uint8Array(), 16321), /Invalid extract length/, 'error when extract length is too long')
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
      q.equal(crypto.decrypt(encrypted.ciphertext, new Uint8Array(24), key), false)
      q.equal(crypto.decrypt(encrypted.ciphertext, encrypted.nonce, new Uint8Array(32)), false)
      encrypted.ciphertext[0] = 255
      q.equal(crypto.decrypt(encrypted.ciphertext, encrypted.nonce, key), false)
    })
  })
})

test('key derivation', (t) => {
  t.plan(8)
  t.equal(crypto.getSeed().length, 32, 'gets 32-byte seed')
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
