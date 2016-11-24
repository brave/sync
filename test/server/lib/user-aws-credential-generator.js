const test = require('tape')
const awsSdk = require('aws-sdk')
const config = require('config')
const crypto = require('../../../lib/crypto')

const UserAwsCredentialGenerator = require('../../../server/lib/user-aws-credential-generator.js')

test('userAwsCredentialGenerator', (t) => {
  t.test('requires userId', (t) => {
    t.throws(
      () => { return new UserAwsCredentialGenerator() },
      'requires userId'
    )
    t.end()
  })

  t.test('perform()', (t) => {
    // TODO: Make this deterministic for tests
    const keys = crypto.deriveKeys(crypto.getSeed())
    const userId = Buffer.from(keys.publicKey).toString('base64')
    let credentialPromise = null

    t.test('returns a Promise resolving with credential data', (t) => {
      const generator = new UserAwsCredentialGenerator(userId)
      credentialPromise = generator.perform()
      t.equal(typeof credentialPromise.then, 'function')
      credentialPromise.then((data) => {
        const credentials = data.Credentials
        t.assert(credentials)
        t.assert(credentials.AccessKeyId)
        t.assert(credentials.SecretAccessKey)
        t.assert(credentials.SessionToken)
      })
      t.end()
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

        t.test('allowed', (t) => {
          t.test('s3 listObjectsV2 {userId}/*', (t) => {
            const params = {
              Bucket: s3Bucket,
              Prefix: `${userId}/`
            }
            s3.listObjectsV2(params).promise()
              .then((data) => { t.assert(data.Contents) })
              .catch((data) => { t.fail(data) })
            t.end()
          })
          t.end()
        })

        t.test('denied', (t) => {
          t.test('s3 listObjectsV2 {another userId}/*', (t) => {
            const keysTwo = crypto.deriveKeys(crypto.getSeed())
            const userIdTwo = Buffer.from(keysTwo.publicKey).toString('base64')
            const params = {
              Bucket: s3Bucket,
              Prefix: userIdTwo
            }
            s3.listObjectsV2(params).promise()
              .then((data) => { t.fail(data, 'should not work') })
              .catch((data) => { t.equal(data.code, 'AccessDenied') })
            t.end()
          })
          t.end()
        })
      })
      t.end()
    })

    t.end()
  })
})
