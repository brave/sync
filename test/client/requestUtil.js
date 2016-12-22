const test = require('tape')
const clientTestHelper = require('./testHelper')
const Serializer = require('../../lib/serializer')
const RequestUtil = require('../../client/requestUtil')

test('client RequestUtil', (t) => {
  t.plan(1)
  t.test('constructor', (t) => {
    t.plan(5)

    Serializer.init().then((serializer) => {
      clientTestHelper.getSerializedCredentials(serializer).then((data) => {
        const args = [
          serializer,
          data.serializedCredentials,
          clientTestHelper.config.apiVersion,
          data.userId
        ]
        t.throws(() => { return new RequestUtil() }, 'requires arguments')
        t.throws(() => { return new RequestUtil(...args.slice(0, 2)) }, 'requires apiVersion')
        t.throws(() => { return new RequestUtil(...args.slice(0, 3)) }, 'requires userId')

        const requestUtil = new RequestUtil(...args)
        t.pass('can instantiate requestUtil')
        t.test('prototype', (t) => {
          testPrototype(t, requestUtil)
        })
      }).catch((error) => { t.end(error) })
    })
  })

  const testPrototype = (t, requestUtil) => {
    t.plan(1)
    t.assert(requestUtil)
  }
})
