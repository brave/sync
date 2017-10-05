const test = require('tape')
const crypto = require('../../../lib/crypto')
const request = require('request')
const requestVerifier = require('../../../server/lib/request-verifier.js')
const serializer = require('../../../lib/serializer.js')
const Express = require('express')

test('users router', (t) => {
  t.plan(4)

  const app = Express()
  app.param('userId', requestVerifier)
  app.post('/:userId/', (_request, response) => { response.send('sweet') })

  const server = app.listen(0, 'localhost', () => {
    serializer.init().then(() => {
      const serverUrl = `http://localhost:${server.address().port}`
      console.log(`server up on ${serverUrl}`)

      const keys = crypto.deriveKeys()
      const userId = Buffer.from(keys.publicKey).toString('base64')
      const baseRequest = request.defaults({
        baseUrl: `${serverUrl}/${encodeURIComponent(userId)}`
      })

      function signedTimestamp (secretKey, timestamp) {
        if (!timestamp) { timestamp = Math.floor(Date.now() / 1000) }
        const message = timestamp.toString()
        return crypto.sign(serializer.serializer.stringToByteArray(message), secretKey)
      }

      const sharedParams = { method: 'POST', url: '/' }
      baseRequest(sharedParams, (_error, response, body) => {
        if (response.statusCode >= 400 && response.statusCode <= 499) {
          t.pass('fails without signed timestamp')
        } else {
          t.fail('should not work')
        }
      })

      const keysTwo = crypto.deriveKeys()
      const mismatchParams = Object.assign(
        sharedParams,
        { body: Buffer.from(signedTimestamp(keysTwo.secretKey).buffer) }
      )
      baseRequest(mismatchParams, (_error, response, body) => {
        if (response.statusCode >= 400 && response.statusCode <= 499) {
          t.pass('fails without signature mismatches URL pubkey')
        } else {
          t.fail('should not work')
        }
      })

      const oldTimestamp = Math.floor(Date.now() / 1000) - 60 * 60
      const oldParams = Object.assign(
        sharedParams,
        { body: Buffer.from(signedTimestamp(keys.secretKey, oldTimestamp).buffer) }
      )
      baseRequest(oldParams, (_error, response, body) => {
        if (response.statusCode >= 400 && response.statusCode <= 499) {
          t.pass('fails with a properly signed old timestamp')
        } else {
          t.fail('should not work')
        }
      })

      const legitParams = Object.assign(
        sharedParams,
        { body: Buffer.from(signedTimestamp(keys.secretKey).buffer) }
      )
      baseRequest(legitParams, (_error, response, body) => {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          t.pass('works when signed correctly')
        } else {
          t.fail('should work')
        }
      })
    })
  })

  test.onFinish(() => {
    server.close()
  })
})
