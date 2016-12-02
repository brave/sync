const test = require('tape')
const awsSdk = require('aws-sdk')
const config = require('config')
const crypto = require('../../../lib/crypto')
const request = require('request')
const timekeeper = require('timekeeper')
const util = require('../../../server/lib/util.js')

const UserAwsS3PostAuthenticator = require('../../../server/lib/user-aws-s3-post-authenticator.js')

test('userAwsS3PostAuthenticator', (t) => {
  t.throws(
    () => { return new UserAwsS3PostAuthenticator() },
    'requires userId'
  )

  t.test('perform()', (t) => {
    const adminS3 = new awsSdk.S3({
      credentials: new awsSdk.Credentials({
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey
      })
    })
    const apiVersion = config.apiVersion
    // const categoryIdBookmarks = config.categoryIdBookmarks
    const categoryIdHistorySites = config.categoryIdHistorySites
    // const categoryIdPreferences = config.categoryIdPreferences
    // TODO: Make this deterministic for tests
    const keys = crypto.deriveKeys(crypto.getSeed())
    const userId = Buffer.from(keys.publicKey).toString('base64')
    let result = null

    const service = new UserAwsS3PostAuthenticator(userId)
    result = service.perform()
    t.equals(result.bucket, config.awsS3Bucket, 'returns S3 bucket')
    t.assert(result.postParams, 'returns post params')

    t.test('works: uploading sync records', (t) => {
      const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result.postParams,
        { file: new Buffer([]) }
      )
      request.post({
        url: util.awsS3Endpoint(),
        formData: formData
      }, (_error, response, body) => {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          t.pass(t.name)
        } else {
          t.fail(`${t.name} (${response.statusCode}) (${body})`)
        }
      })

      test.onFinish(() => {
        adminS3.deleteObject({
          Bucket: config.awsS3Bucket,
          Key: `${apiVersion}/${userId}`
        })
      })
      t.end()
    })

    t.test('deny: uploading sync records with expired signed params', (t) => {
      timekeeper.freeze(new Date().getTime() - config.userAwsCredentialTtl * 1000)
      const result = new UserAwsS3PostAuthenticator(userId).perform()
      timekeeper.reset()

      const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result.postParams,
        { file: new Buffer([]) }
      )
      request.post({
        url: util.awsS3Endpoint(),
        formData: formData
      }, (_error, response, body) => {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          t.fail(`${t.name} (${response.statusCode}) (${body})`)
        } else {
          t.pass(t.name)
        }
      })

      t.end()
    })

    t.test('deny: uploading to another user\'s prefix', (t) => {
      const keysTwo = crypto.deriveKeys(crypto.getSeed())
      const userIdTwo = Buffer.from(keysTwo.publicKey).toString('base64')
      const objectKey = `${apiVersion}/${userIdTwo}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result.postParams,
        { file: new Buffer([1, 2, 3]) }
      )
      request.post({
        url: util.awsS3Endpoint(),
        formData: formData
      }, (_error, response, body) => {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          t.fail(`${t.name} (${body})`)
        } else {
          t.pass(t.name)
        }
      })
      t.end()
    })

    t.test('deny: uploading objects with content', (t) => {
      const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result.postParams,
        { file: new Buffer([1, 2, 3]) }
      )
      request.post({
        url: util.awsS3Endpoint(),
        formData: formData
      }, (_error, response, body) => {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          t.fail(`${t.name} (${body})`)
        } else {
          t.pass(t.name)
        }
      })
      t.end()
    })

    t.end()
  })
})
