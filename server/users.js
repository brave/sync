'use strict'

const Express = require('express')
const redis = require('./redis.js')
const requestVerifier = require('./lib/request-verifier.js')
const router = Express.Router()
const serializer = require('../lib/serializer.js')
const config = require('config')
const Util = require('./lib/util.js')
// TODO: This returns a Promise; we may want to block requests until it resolves
serializer.init()

const UserAwsCredentialGenerator = require('./lib/user-aws-credential-generator')
const UserAwsS3PostAuthenticator = require('./lib/user-aws-s3-post-authenticator')

const BUCKET = config.awsS3Bucket
const REGION = config.awsRegion

router.param('userId', requestVerifier)

// Generate temporary AWS credentials allowing user to access their Sync data.
router.post('/:userId/credentials', (request, response) => {
  const credentialPromise = new UserAwsCredentialGenerator(request.userId, BUCKET).perform()
  const postAuthenticatorPromise = new Promise((resolve, reject) => {
    try {
      const s3PostParams = new UserAwsS3PostAuthenticator(request.userId, BUCKET).perform()
      resolve(s3PostParams)
    } catch (exception) {
      reject(exception)
    }
  })

  const date = new Date().toISOString().split('T')[0]
  const platform = Util.parsePlatform(request.headers['user-agent'])
  const key = ['sync', 'dau', date, platform].join('-')
  redis.pfadd(key, request.userId, function (err, reply) {
    if (err) {
      Util.logger.error('error recording DAU in redis', err)
    }
  })

  Promise.all([credentialPromise, postAuthenticatorPromise])
    .then(([aws, s3Post]) => {
      const serialized = serializer.serializer.credentialsToByteArray({aws, s3Post, bucket: BUCKET, region: REGION})
      response.send(serialized)
    })
    .catch((error) => { response.status(401).send(error) })
})

router.get('/', (_request, response) => {
  response.send('☁️🎬✌️')
})

module.exports = router
