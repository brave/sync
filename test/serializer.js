const test = require('tape')
const serializer = require('../lib/serializer')

test('serializing strings', (t) => {
  const messages = ['€ are my favorite moneys', 'hello world',
    'test abc     ', '']
  t.plan(4)
  serializer.init().then((s) => {
    messages.forEach((msg) => {
      const bytes = s.stringToByteArray(msg)
      t.equal(s.byteArrayToString(bytes), msg)
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
      AWSAccessKeyId: 'AKIAIOSFODNN7EXAMPL3',
      policy: '{"expiration": "2015-04-20T13:37:00.000Z","conditions": [{"bucket": "cool-bucket"}',
      signature: 'something really secret todo we could validate it',
      acl: 'private'
    },
    bucket: 'cool-bucket',
    region: 'us-west-2'
  }

  serializer.init().then((serializer) => {
    const serialized = serializer.credentialsToByteArray(credentials)
    const serializedClass = Object.prototype.toString.call(serialized)
    t.equal(serializedClass, '[object Uint8Array]', 'serializes credentials')

    const deserialized = serializer.byteArrayToCredentials(serialized)
    t.equal(
      deserialized.constructor,
      serializer.api.Credentials,
      'deserializes to api.Credentials protobuf type'
    )
    t.equal(
      deserialized.aws.constructor,
      serializer.api.Credentials.Aws,
      'credentials include api.Credentials.Aws protobuf type'
    )
    t.equal(
      deserialized.s3Post.constructor,
      serializer.api.Credentials.S3Post,
      'credentials include api.Credentials.S3Post protobuf type'
    )
  })
})
