const Express = require('express')
var router = Express.Router()

var UserAwsCredentialGenerator = require('./services/user-aws-credential-generator')

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
  const service = new UserAwsCredentialGenerator(request.userId)
  service.perform()
    .then((data) => {
      response.send(data.Credentials)
    })
    .catch((error) => { response.send(error) })
})

module.exports = router
