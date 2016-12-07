const test = require('tape')
const serializer = require('../lib/serializer')

test('init', (t) => {
  t.plan(1)
  serializer.init('nonexistent').catch((e) => {
    t.equal('Proto file could not be loaded.', e.message)
  })
})

test('serializing strings', (t) => {
  const messages = ['€ are my favorite moneys', 'hello world',
    'test abc     ', '']
  t.plan(4)
  serializer.init().then((s) => {
    messages.forEach((msg) => {
      const bytes = s.stringToByteArray(msg)
      t.equal(msg, s.byteArrayToString(bytes))
    })
  })
})

test('serializing aws and s3 credentials', (t) => {
  t.plan(4)

  const credentials = {
    aws: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      sessionToken: 'AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/LTo6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3zrkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtpZ3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
      expiration: '2015-04-20T13:37:00.000Z'
    },
    s3Post: {
      bucket: 'cool-bucket',
      postData: {
        AWSAccessKeyId: 'AKIAIOSFODNN7EXAMPL3',
        policy: '{"expiration": "2015-04-20T13:37:00.000Z","conditions": [{"bucket": "cool-bucket"}',
        signature: 'something really secret todo we could validate it',
        acl: 'private'
      }
    }
  }

  serializer.init().then((serializer) => {
    const serialized = serializer.credentialsToByteArray(credentials)
    const serializedClass = Object.prototype.toString.call(serialized)
    t.equal(serializedClass, '[object Uint8Array]', 'serializes credentials')

    const deserialized = serializer.byteArrayToCredentials(serialized)
    t.equal(
      deserialized.$type,
      serializer.api.Credentials,
      'deserializes to api.Credentials protobuf type'
    )
    t.equal(
      deserialized.aws.$type,
      serializer.api.Credentials.lookup('Aws'),
      'credentials include api.Credentials.Aws protobuf type'
    )
    t.equal(
      deserialized.s3Post.$type,
      serializer.api.Credentials.lookup('S3Post'),
      'credentials include api.Credentials.S3Post protobuf type'
    )
  })
})
