const test = require('tape')
const awsSdk = require('aws-sdk')
const config = require('config')
const crypto = require('../../lib/crypto')
const request = require('request')
const serializer = require('../../lib/serializer.js')
const usersRouter = require('../../server/users.js')
const util = require('../../server/lib/util.js')
const Express = require('express')

test('users router', (t) => {
  const app = Express()
  app.use('/', usersRouter)
  const server = app.listen(0, 'localhost', () => {
    serializer.initSerializer().then(() => {
      const serverUrl = `http://localhost:${server.address().port}`
      console.log(`server up on ${serverUrl}`)

      const keys = crypto.deriveKeys(crypto.getSeed())
      const userId = Buffer.from(keys.publicKey).toString('base64')
      const baseRequest = request.defaults({
        baseUrl: `${serverUrl}/${encodeURIComponent(userId)}`
      })

      const apiVersion = config.apiVersion
      const categoryIdHistorySites = config.categoryIdHistorySites
      const s3Bucket = config.awsS3Bucket

      function signedTimestamp (secretKey, timestamp) {
        if (!timestamp) { timestamp = Math.floor(Date.now() / 1000) }
        const message = timestamp.toString()
        return crypto.sign(serializer.serializer.stringToByteArray(message), secretKey)
      }

      t.test('POST /:userId/credentials', (t) => {
        const sharedParams = { method: 'POST', url: '/credentials' }
        baseRequest(sharedParams, (_error, response, body) => {
          if (response.statusCode >= 400 && response.statusCode <= 499) {
            t.pass('required signed timestamp')
          } else {
            t.fail('should not work')
          }
        })

        const params = Object.assign(
          sharedParams,
          { body: Buffer.from(signedTimestamp(keys.secretKey).buffer) }
        )
        baseRequest(params, (error, response, body) => {
          if (error) { return t.fail(`${t.name} ${error} ${response}`) }
          t.equals(response.statusCode, 200, `${t.name} -> 200`)

          // TODO: Use protobuf?
          const parsedBody = JSON.parse(response.body)
          const credentials = parsedBody.awsCredentials
          t.assert(credentials, 'response has aws credentials')
          const s3PostParams = parsedBody.s3PostParams
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
    })
  })

  test.onFinish(() => {
    server.close()
  })
})
