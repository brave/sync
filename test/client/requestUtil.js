const test = require('tape')
const testHelper = require('../testHelper')
const timekeeper = require('timekeeper')
const clientTestHelper = require('./testHelper')
const cryptoUtil = require('../../client/cryptoUtil')
const Serializer = require('../../lib/serializer')
const RequestUtil = require('../../client/requestUtil')
const proto = require('../../client/constants/proto')

test('client RequestUtil', (t) => {
  t.plan(1)
  t.test('constructor', (t) => {
    t.plan(7)

    Serializer.init().then((serializer) => {
      clientTestHelper.getSerializedCredentials(serializer).then((data) => {
        const args = {
          apiVersion: clientTestHelper.CONFIG.apiVersion,
          credentialsBytes: data.serializedCredentials,
          keys: data.keys,
          serializer,
          serverUrl: clientTestHelper.CONFIG.serverUrl
        }

        t.throws(() => { return new RequestUtil() }, 'requires arguments')
        const requiredArgs = ['apiVersion', 'keys', 'serializer', 'serverUrl']
        for (let arg of requiredArgs) {
          let lessArgs = Object.assign({}, args)
          lessArgs[arg] = undefined
          t.throws(() => { return new RequestUtil(lessArgs) }, `requires ${arg}`)
        }

        const requestUtil = new RequestUtil(args)
        t.pass('can instantiate requestUtil')
        t.test('prototype', (t) => {
          testPrototype(t, requestUtil, data.keys)
        })
      }).catch((error) => { t.end(error) })
    })
  })

  const testPrototype = (t, requestUtil, keys) => {
    test.onFinish(() => {
      requestUtil.deleteUser()
        .catch((error) => { console.log(`Cleanup failed: ${error}`) })
    })
    const serializer = requestUtil.serializer
    const decrypt = testHelper.Decrypt(serializer, keys.secretboxKey)
    const encrypt = cryptoUtil.Encrypt(serializer, keys.secretboxKey, 0)

    t.plan(2)
    t.test('#put preference: device', (t) => {
      t.plan(2)
      const deviceId = new Uint8Array([0])
      const name = 'alpha pyramid'
      let objectId = testHelper.uuid()
      const record = {
        action: 'CREATE',
        deviceId,
        objectId,
        device: {name}
      }
      timekeeper.freeze(1480000000 * 1000)
      requestUtil.put(proto.categories.PREFERENCES, encrypt(record))
        .then((response) => {
          timekeeper.reset()
          t.pass(`${t.name} resolves`)
          testCanListPreferences(t, record)
        })
        .catch((error) => { t.fail(error) })
    })

    const testCanListPreferences = (t, deviceRecord) => {
      t.test('#list preferences lists the key', (t) => {
        t.plan(5)
        requestUtil.list(proto.categories.PREFERENCES)
          .then((response) => {
            const s3Record = decrypt(response[0])
            // FIXME: Should this deserialize to 'CREATE' ?
            t.equals(s3Record.action, 0, `${t.name}: action`)
            t.deepEquals(s3Record.deviceId, deviceRecord.deviceId, `${t.name}: deviceId`)
            t.deepEquals(s3Record.objectId, deviceRecord.objectId, `${t.name}: objectId`)
            t.deepEquals(s3Record.device, deviceRecord.device, `${t.name}: device`)
            testCanListWithTimestamp(t)
          })
          .catch((error) => { t.fail(error) })
      })
    }

    const testCanListWithTimestamp = (t) => {
      t.test('#list preferences can list records in chronological order starting after a timestamp', (t) => {
        t.plan(5)

        const deviceId = new Uint8Array([0])
        const putRecordAtTime = (timestampSeconds) => {
          timekeeper.freeze(timestampSeconds * 1000)
          const name = `pyramid at ${timestampSeconds}`
          let objectId = testHelper.uuid()
          const record = {
            action: 'UPDATE',
            deviceId,
            objectId,
            device: {name}
          }
          const putRequest = requestUtil.put(proto.categories.PREFERENCES, encrypt(record))
          timekeeper.reset()
          return putRequest
        }

        const TIME_A = 1480001000
        const TIME_B = 1480002000
        const TIME_C = 1480003000
        const TIME_D = 1480004000
        // Simulate delays by syncing records out of order
        putRecordAtTime(TIME_D)
          .then(() => {
            Promise.all([
              putRecordAtTime(TIME_B),
              putRecordAtTime(TIME_A),
              putRecordAtTime(TIME_C)
            ])
            .then(() => {
              requestUtil.list(proto.categories.PREFERENCES, TIME_B)
                .then((response) => {
                  t.equals(response.length, 3, t.name)
                  const s3Record0 = decrypt(response[0])
                  const s3Record1 = decrypt(response[1])
                  const s3Record2 = decrypt(response[2])
                  t.equals(s3Record0.device.name, `pyramid at ${TIME_B}`)
                  t.equals(s3Record1.device.name, `pyramid at ${TIME_C}`)
                  t.equals(s3Record2.device.name, `pyramid at ${TIME_D}`)
                  testCanDeletePreferences(t)
                })
                .catch((error) => { t.fail(error) })
            })
            .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })
    }

    const testCanDeletePreferences = (t) => {
      t.test('#deleteCategory preferences', (t) => {
        t.plan(1)
        requestUtil.deleteCategory(proto.categories.PREFERENCES)
          .then((_response) => {
            requestUtil.list(proto.categories.PREFERENCES)
              .then((response) => {
                t.equals(response.length, 0, `${t.name} works`)
              })
              .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })
    }

    const expiredCredentials = {
      aws: clientTestHelper.EXPIRED_CREDENTIALS.aws,
      s3Post: clientTestHelper.EXPIRED_CREDENTIALS.s3Post,
      bucket: requestUtil.bucket,
      region: requestUtil.region
    }
    t.test('RequestUtil with expired credentials', (t) => {
      t.plan(3)

      const expiredArgs = {
        apiVersion: clientTestHelper.CONFIG.apiVersion,
        credentialsBytes: serializer.credentialsToByteArray(expiredCredentials),
        keys,
        serializer,
        serverUrl: clientTestHelper.CONFIG.serverUrl
      }

      t.doesNotThrow(() => { return new RequestUtil(expiredArgs) }, `${t.name} instantiates without error`)

      t.test('#refreshAWSCredentials()', (t) => {
        t.plan(2)
        const args = {
          apiVersion: clientTestHelper.CONFIG.apiVersion,
          keys,
          serializer,
          serverUrl: clientTestHelper.CONFIG.serverUrl
        }
        const requestUtil = new RequestUtil(args)
        t.equals(requestUtil.s3, undefined, `${t.name} s3 is undefined`)
        requestUtil.refreshAWSCredentials()
          .then(() => {
            requestUtil.list(proto.categories.PREFERENCES)
              .then((response) => {
                t.equals(response.length, 0, `${t.name} works`)
              })
              .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })

      t.test('automatic credential refresh', (t) => {
        t.plan(2)

        t.test(`${t.name} list()`, (t) => {
          t.plan(1)
          const requestUtil = new RequestUtil(expiredArgs)
          requestUtil.list(proto.categories.PREFERENCES)
            .then((response) => { t.equals(response.length, 0, t.name) })
            .catch((error) => { t.fail(error) })
        })

        t.test(`${t.name} put()`, (t) => {
          t.plan(2)
          const record = {
            action: 'CREATE',
            deviceId: new Uint8Array([1]),
            objectId: testHelper.uuid(),
            device: {name: 'sweet'}
          }
          const requestUtil = new RequestUtil(expiredArgs)
          requestUtil.put(proto.categories.PREFERENCES, encrypt(record))
            .then((response) => {
              t.pass(t.name)
              testCredentialRefreshDelete(t)
            })
            .catch((error) => { t.fail(error) })
        })

        const testCredentialRefreshDelete = (t) => {
          t.test(`${t.name} deleteCategory()`, (t) => {
            t.plan(1)
            const requestUtil = new RequestUtil(expiredArgs)
            requestUtil.deleteCategory(proto.categories.PREFERENCES)
              .then((response) => { t.pass(t.name) })
              .catch((error) => { t.fail(error) })
          })
        }
      })
    })
  }
})
