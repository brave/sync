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
    const apiVersion = config.apiVersion
    const categoryIdBookmarks = config.categoryIdBookmarks
    const categoryIdHistorySites = config.categoryIdHistorySites
    const categoryIdPreferences = config.categoryIdPreferences
    // TODO: Make this deterministic for tests
    const keys = crypto.deriveKeys(crypto.getSeed())
    const userId = Buffer.from(keys.publicKey).toString('base64')
    let credentialPromise = null

    const generator = new UserAwsCredentialGenerator(userId)
    credentialPromise = generator.perform()
    t.equal(typeof credentialPromise.then, 'function', 'perform() returns a Promise')
    credentialPromise.then((data) => {
      t.assert(data.accessKeyId, 'credentials include AccessKeyId')
      t.assert(data.secretAccessKey, 'credentials include SecretAccessKey')
      t.assert(data.sessionToken, 'credentials include SessionToken')
    })
      .catch((data) => { t.fail(`promise should resolve (${data})`) })

    t.test('credential AWS permissions', (t) => {
      credentialPromise.then((data) => {
        awsSdk.region = config.awsRegion
        const credentialData = {
          accessKeyId: data.accessKeyId,
          secretAccessKey: data.secretAccessKey,
          sessionToken: data.sessionToken
        }
        const s3 = new awsSdk.S3({
          credentials: new awsSdk.Credentials(credentialData)
        })
        const s3Bucket = config.awsS3Bucket
        const adminS3 = new awsSdk.S3({
          credentials: new awsSdk.Credentials({
            accessKeyId: config.awsAccessKeyId,
            secretAccessKey: config.awsSecretAccessKey
          })
        })

        t.test('permissions', (t) => {
          t.test('allow: s3 listObjectsV2 {apiVersion}/{userId}/*', (t) => {
            s3.listObjectsV2({
              Bucket: s3Bucket,
              Prefix: `${apiVersion}/${userId}/`
            }).promise()
              .then((data) => { t.assert(data.Contents, t.name) })
              .catch((data) => { t.fail(t.name) })
            t.end()
          })

          t.test('allow: s3 listObjectsV2 {apiVersion}/{userId}/{categoryIdBookmarks}/*', (t) => {
            s3.listObjectsV2({
              Bucket: s3Bucket,
              Prefix: `${apiVersion}/${userId}/${categoryIdBookmarks}`
            }).promise()
              .then((data) => { t.assert(data.Contents, t.name) })
              .catch((data) => { t.fail(t.name) })
            t.end()
          })

          t.test('allow: s3 listObjectsV2 {apiVersion}/{userId}/{categoryIdHistorySites}/*', (t) => {
            const prefix = `${apiVersion}/${userId}/${categoryIdHistorySites}`
            s3.listObjectsV2({
              Bucket: s3Bucket,
              Prefix: prefix
            }).promise()
              .then((data) => { t.assert(data.Contents, t.name) })
              .catch((data) => { t.fail(t.name) })
            s3.listObjectsV2({
              Bucket: s3Bucket,
              Prefix: prefix,
              StartAfter: `${prefix}/1230`
            }).promise()
              .then((data) => { t.assert(data.Contents, `${t.name} StartAfter`) })
              .catch((data) => { t.fail(`${t.name} StartAfter`) })
            t.end()
          })

          t.test('allow: s3 listObjectsV2 {apiVersion}/{userId}/{categoryIdPreferences}/*', (t) => {
            s3.listObjectsV2({
              Bucket: s3Bucket,
              Prefix: `${apiVersion}/${userId}/${categoryIdPreferences}`
            }).promise()
              .then((data) => { t.assert(data.Contents, t.name) })
              .catch((data) => { t.fail(t.name) })
            t.end()
          })

          t.test('allow: s3 deleteObject {apiVersion}/{userId}/{categoryIdHistorySites}', (t) => {
            adminS3.putObject({
              Bucket: s3Bucket,
              Key: `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/recordData`
            }).promise()
              .then((data) => {
                s3.deleteObject({
                  Bucket: s3Bucket,
                  Key: `${apiVersion}/${userId}/${categoryIdHistorySites}`
                }).promise()
                  .then((data) => { t.pass(t.name) })
                  .catch((data) => { t.fail(t.name) })
              })
              .catch((data) => { t.fail(t.name) })
            t.end()
          })

          t.test('allow: s3 deleteObject {apiVersion}/{userId}', (t) => {
            adminS3.putObject({
              Bucket: s3Bucket,
              Key: `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/recordData`
            }).promise()
              .then((data) => {
                s3.deleteObject({
                  Bucket: s3Bucket,
                  Key: `${apiVersion}/${userId}`
                }).promise()
                  .then((data) => { t.pass(t.name) })
                  .catch((data) => { t.fail(t.name) })
              })
              .catch((data) => { t.fail(t.name) })
            t.end()
          })

          // Note we don't grant putObject here; it's authorized with
          // signed POST requests to limit upload size.
          t.test('deny: s3 putObject {apiVersion}/{userId}/{...}', (t) => {
            s3.putObject({
              Bucket: s3Bucket,
              Key: `${apiVersion}/${userIdTwo}/{categoryIdPreferences}/1234/recordData`
            }).promise()
              .then((data) => { t.fail(data, t.name) })
              .catch((data) => { t.equal(data.code, 'AccessDenied', t.name) })
            t.end()
          })

          const keysTwo = crypto.deriveKeys(crypto.getSeed())
          const userIdTwo = Buffer.from(keysTwo.publicKey).toString('base64')

          t.test('deny: s3 listObjectsV2 {apiVersion}/{another userId}/*', (t) => {
            const keysTwo = crypto.deriveKeys(crypto.getSeed())
            const userIdTwo = Buffer.from(keysTwo.publicKey).toString('base64')
            s3.listObjectsV2({
              Bucket: s3Bucket,
              Prefix: `${apiVersion}/${userIdTwo}/`
            }).promise()
              .then((data) => { t.fail(data, t.name) })
              .catch((data) => { t.equal(data.code, 'AccessDenied', t.name) })
            t.end()
          })

          t.test('deny: s3 putObject {apiVersion}/{another userId}/{...}', (t) => {
            s3.putObject({
              Bucket: s3Bucket,
              Key: `${apiVersion}/${userIdTwo}/{categoryIdPreferences}/1234/recordData`
            }).promise()
              .then((data) => { t.fail(data, t.name) })
              .catch((data) => { t.equal(data.code, 'AccessDenied', t.name) })
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
