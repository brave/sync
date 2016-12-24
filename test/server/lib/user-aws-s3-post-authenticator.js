const test = require('tape')
const testHelper = require('../../testHelper')
const awsSdk = require('aws-sdk')
const config = require('config')
const crc = require('crc')
const crypto = require('../../../lib/crypto')
const request = require('request')
const timekeeper = require('timekeeper')
const util = require('../../../server/lib/util.js')
const s3Helper = require('../../../lib/s3Helper')
const Serializer = require('../../../lib/serializer')

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
    const keys = crypto.deriveKeys(crypto.getSeed())
    const userId = Buffer.from(keys.publicKey).toString('base64')
    let result = null

    const service = new UserAwsS3PostAuthenticator(userId, config.awsS3Bucket)

    result = service.perform()
    t.assert(
      (result.AWSAccessKeyId && result.policy && result.signature && result.acl),
      'returns post params'
    )

    Serializer.init().then((serializer) => {
      const decrypt = testHelper.Decrypt(serializer, keys.secretboxKey)
      const encrypt = testHelper.Encrypt(serializer, keys.secretboxKey)

      // Should implement S3 POST as in requestUtil #put.
      t.test('works: uploading sync records (preference: device)', (t) => {
        t.plan(2)

        const deviceId = new Uint8Array([0])
        const name = 'alpha pyramid'
        const objectId = new Uint8Array([228, 182, 188, 190, 5, 48, 77, 121, 188, 254, 90, 138, 211, 201, 47, 184])
        let record = {
          action: 'CREATE', // CREATE
          deviceId,
          objectId,
          device: {name}
        }

        const encryptedData = encrypt(record)
        const encryptedDataCrc = crc.crc32.unsigned(encryptedData.buffer).toString(36)
        const s3String = s3Helper.byteArrayToS3String(encryptedData)

        const timestamp = 1482435340
        const objectKey = `${apiVersion}/${userId}/${categoryIdPreferences}/${timestamp}/${encryptedDataCrc}/0/${s3String}`
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
            testRecordContent(t)
          } else {
            t.fail(`${t.name} (${response.statusCode}) (${body})`)
          }
        })

        const testRecordContent = (t) => {
          t.test('preference: device record content', (t) => {
            t.plan(4)
            const listParams = {
              Bucket: config.awsS3Bucket,
              Prefix: `${apiVersion}/${userId}/${categoryIdPreferences}`
            }
            adminS3.listObjectsV2(listParams).promise()
              .then((data) => {
                const object = s3Helper.parseS3Key(data.Contents[0].Key)
                const recordBytes = s3Helper.s3StringToByteArray(object.recordPartString)
                const s3Record = decrypt(recordBytes)
                // FIXME: Should this deserialize to 'CREATE' ?
                t.equals(s3Record.action, 0, `${t.name}: action`)
                t.deepEquals(s3Record.deviceId, record.deviceId, `${t.name}: deviceId`)
                t.deepEquals(s3Record.objectId, record.objectId, `${t.name}: objectId`)
                t.deepEquals(s3Record.device, record.device, `${t.name}: device`)
              })
              .catch((error) => {
                t.fail(`${t.name} error: ${error}`)
              })
          })
        }

        // TODO: Doesn't work
        // test.onFinish(() => {
        //   adminS3.deleteObject({
        //     Bucket: config.awsS3Bucket,
        //     Key: `${apiVersion}/${userId}`
        //   })
        // })
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

        // TODO: Doesn't work
        // test.onFinish(() => {
        //   adminS3.deleteObject({
        //     Bucket: config.awsS3Bucket,
        //     Key: `${apiVersion}/${userId}`
        //   })
        // })
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

        // TODO: Doesn't work
        // test.onFinish(() => {
        //   adminS3.deleteObject({
        //     Bucket: config.awsS3Bucket,
        //     Key: `${apiVersion}/${userId}`
        //   })
        // })
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
})
