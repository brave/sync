const test = require('tape')
const awsSdk = require('aws-sdk')
const config = require('config')
const crypto = require('../../../lib/crypto')

const UserAwsCredentialGenerator = require('../../../server/lib/user-aws-credential-generator.js')

test('userAwsCredentialGenerator', (t) => {
  t.throws(
    () => { return new UserAwsCredentialGenerator() },
    'requires userId'
  )

  t.test('perform()', (t) => {
    // TODO: Make this deterministic for tests
    const keys = crypto.deriveKeys(crypto.getSeed())
    const userId = Buffer.from(keys.publicKey).toString('base64')
    let credentialPromise = null

    const generator = new UserAwsCredentialGenerator(userId)
    credentialPromise = generator.perform()
    t.equal(typeof credentialPromise.then, 'function', 'perform() returns a Promise')
    credentialPromise.then((data) => {
      const credentials = data.Credentials
      t.assert(credentials, 'perform() resolves and returns credentials')
      t.assert(credentials.AccessKeyId, 'credentials include AccessKeyId')
      t.assert(credentials.SecretAccessKey, 'credentials include SecretAccessKey')
      t.assert(credentials.SessionToken, 'credentials include SessionToken')
    })

    t.test('credential AWS permissions', (t) => {
      credentialPromise.then((data) => {
        const credentials = data.Credentials
        awsSdk.config.credentials = new awsSdk.Credentials({
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretAccessKey,
          sessionToken: credentials.SessionToken
        })
        awsSdk.region = config.awsRegion
        const s3 = new awsSdk.S3()
        const s3Bucket = config.awsS3Bucket

        t.test('permissions allowed', (t) => {
          const params = {
            Bucket: s3Bucket,
            Prefix: `${userId}/`
          }
          s3.listObjectsV2(params).promise()
            .then((data) => { t.assert(data.Contents, 's3 listObjectsV2 {userId}/* is allowed') })
            .catch((data) => { t.fail('s3 listObjectsV2 {another userId}/* should be allowed') })
          t.end()
        })

        t.test('permissions denied', (t) => {
          const keysTwo = crypto.deriveKeys(crypto.getSeed())
          const userIdTwo = Buffer.from(keysTwo.publicKey).toString('base64')
          const params = {
            Bucket: s3Bucket,
            Prefix: userIdTwo
          }
          s3.listObjectsV2(params).promise()
            .then((data) => { t.fail(data, 's3 listObjectsV2 {another userId}/* should be denied') })
            .catch((data) => { t.equal(data.code, 'AccessDenied', 's3 listObjectsV2 {another userId}/* is denied') })
          t.end()
        })
      })
      t.end()
    })

    t.end()
  })
})
