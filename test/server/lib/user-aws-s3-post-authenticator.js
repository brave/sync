const test = require('tape')
const awsSdk = require('aws-sdk')
const config = require('config')
const crypto = require('../../../lib/crypto')
const request = require('request')
const timekeeper = require('timekeeper')
const util = require('../../../server/lib/util.js')

const UserAwsS3PostAuthenticator = require('../../../server/lib/user-aws-s3-post-authenticator.js')

test('userAwsS3PostAuthenticator', (t) => {
  t.plan(3)

  t.throws(
    () => { return new UserAwsS3PostAuthenticator() },
    'requires userId'
  )

  t.throws(
    () => { return new UserAwsS3PostAuthenticator('userId') },
    'requires s3Bucket'
  )

  t.test('perform()', (t) => {
    t.plan(7)

    const adminS3 = new awsSdk.S3({
      credentials: new awsSdk.Credentials({
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey
      })
    })
    const apiVersion = config.apiVersion
    const categoryIdBookmarks = config.categoryIdBookmarks
    const categoryIdHistorySites = config.categoryIdHistorySites
    const categoryIdPreferences = config.categoryIdPreferences
    // TODO: Make this deterministic for tests
    const keys = crypto.deriveKeys(crypto.getSeed())
    const userId = Buffer.from(keys.publicKey).toString('base64')
    let result = null

    const service = new UserAwsS3PostAuthenticator(userId, config.awsS3Bucket)

    result = service.perform()
    t.assert(
      (result.AWSAccessKeyId && result.policy && result.signature && result.acl),
      'returns post params'
    )

    t.test('works: uploading sync records (historySites)', (t) => {
      t.plan(1)

      const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result,
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
    })

    t.test('works: uploading sync records (bookmarks)', (t) => {
      t.plan(1)

      const objectKey = `${apiVersion}/${userId}/${categoryIdBookmarks}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result,
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
    })

    t.test('works: uploading sync records (preferences)', (t) => {
      t.plan(1)

      const objectKey = `${apiVersion}/${userId}/${categoryIdPreferences}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result,
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
    })

    t.test('deny: uploading sync records with expired signed params', (t) => {
      t.plan(1)

      timekeeper.freeze(new Date().getTime() - config.userAwsCredentialTtl * 1000 - 60 * 1000)
      const result = new UserAwsS3PostAuthenticator(userId, config.awsS3Bucket).perform()
      timekeeper.reset()

      const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result,
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
    })

    t.test('deny: uploading to another user\'s prefix', (t) => {
      t.plan(1)

      const keysTwo = crypto.deriveKeys(crypto.getSeed())
      const userIdTwo = Buffer.from(keysTwo.publicKey).toString('base64')
      const objectKey = `${apiVersion}/${userIdTwo}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result,
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
    })

    t.test('deny: uploading objects with content', (t) => {
      t.plan(1)

      const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
      const formData = Object.assign(
        {},
        { key: objectKey },
        result,
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
    })
  })
})
