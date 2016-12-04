'use strict'

const Express = require('express')
var router = Express.Router()

var UserAwsCredentialGenerator = require('./lib/user-aws-credential-generator')
var UserAwsS3PostAuthenticator = require('./lib/user-aws-s3-post-authenticator')

// Shared
// ===
// Verify request signature with pubkey.
function verifyRequest (request, response, next, userId) {
  // TODO
  request.userId = userId
  next()
}

// Routes
// ===

router.param('userId', verifyRequest)

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
    .then(([credentials, s3PostParams]) => {
      response.send({credentials: credentials, s3PostParams: s3PostParams})
    })
    .catch((error) => { response.send(error) })
})

router.get('/', (_request, response) => {
  response.send('☁️🎬✌️')
})

module.exports = router
