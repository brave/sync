const test = require('tape')
const awsSdk = require('aws-sdk')
const config = require('config')
const crypto = require('../../lib/crypto')
const request = require('request')
const supertest = require('supertest')
const usersRouter = require('../../server/users.js')
const util = require('../../server/lib/util.js')
const Express = require('express')

test('users router', (t) => {
  const apiVersion = config.apiVersion
  const categoryIdHistorySites = config.categoryIdHistorySites
  const app = Express()
  app.use('/', usersRouter)
  t.test('POST /:userId/credentials', (t) => {
    // TODO: Make this deterministic for tests
    const keys = crypto.deriveKeys(crypto.getSeed())
    const s3Bucket = config.awsS3Bucket
    const userId = Buffer.from(keys.publicKey).toString('base64')

    supertest(app).post(`/${encodeURIComponent(userId)}/credentials`).end((error, response) => {
      if (error) {
        return t.fail(`${t.name} ${error} ${response}`)
      }
      t.equals(response.statusCode, 200, `${t.name} HTTP 200`)
      const body = response.body
      const credentials = body.credentials
      t.assert(credentials, 'response has aws credentials')
      const s3PostParams = body.s3PostParams
      t.assert(s3PostParams, 'response has s3 post params')

      t.test('aws credentials', (t) => {
        const s3 = new awsSdk.S3({
          credentials: new awsSdk.Credentials({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken
          })
        })
        t.test('allow: s3 listObjectsV2 {apiVersion}/{userId}/*', (t) => {
          s3.listObjectsV2({
            Bucket: s3Bucket,
            Prefix: `${apiVersion}/${userId}/`
          }).promise()
            .then((data) => { t.assert(data.Contents, t.name) })
            .catch((data) => { t.fail(t.name) })
          t.end()
        })
        t.end()
      })

      t.test('s3 post params', (t) => {
        const adminS3 = new awsSdk.S3({
          credentials: new awsSdk.Credentials({
            accessKeyId: config.awsAccessKeyId,
            secretAccessKey: config.awsSecretAccessKey
          })
        })

        t.test('works: uploading sync records (historySites)', (t) => {
          const objectKey = `${apiVersion}/${userId}/${categoryIdHistorySites}/1234/objectData`
          const formData = Object.assign(
            {},
            { key: objectKey },
            s3PostParams.postParams,
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
      })
    })
  })
  t.end()
})
