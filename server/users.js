'use strict'

const Express = require('express')
const requestVerifier = require('./lib/request-verifier.js')
const router = Express.Router()
const serializer = require('../lib/serializer.js')
// TODO: This returns a Promise; we may want to block requests until it resolves
serializer.initSerializer()

const UserAwsCredentialGenerator = require('./lib/user-aws-credential-generator')
const UserAwsS3PostAuthenticator = require('./lib/user-aws-s3-post-authenticator')

router.param('userId', requestVerifier)

// Generate temporary AWS credentials allowing user to access their Sync data.
router.post('/:userId/credentials', (request, response) => {
  const credentialPromise = new UserAwsCredentialGenerator(request.userId).perform()
  const postAuthenticatorPromise = new Promise((resolve, reject) => {
    try {
      const s3PostParams = new UserAwsS3PostAuthenticator(request.userId).perform()
      resolve(s3PostParams)
    } catch (exception) {
      reject(exception)
    }
  })

  Promise.all([credentialPromise, postAuthenticatorPromise])
    .then(([awsCredentials, s3PostParams]) => {
      response.send({awsCredentials, s3PostParams})
    })
    .catch((error) => { response.send(error) })
})

router.get('/', (_request, response) => {
  response.send('☁️🎬✌️')
})

module.exports = router
