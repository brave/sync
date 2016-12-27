const test = require('tape')
const testHelper = require('../testHelper')
const timekeeper = require('timekeeper')
const clientTestHelper = require('./testHelper')
const Serializer = require('../../lib/serializer')
const RequestUtil = require('../../client/requestUtil')
const proto = require('../../client/constants/proto')

test('client RequestUtil', (t) => {
  t.plan(1)
  t.test('constructor', (t) => {
    t.plan(5)

    Serializer.init().then((serializer) => {
      clientTestHelper.getSerializedCredentials(serializer).then((data) => {
        const keys = data.keys
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
          testPrototype(t, requestUtil, keys)
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
    const encrypt = clientTestHelper.Encrypt(serializer, keys.secretboxKey)

    t.plan(1)
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
  }
})
