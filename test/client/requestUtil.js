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
      requestUtil.put(proto.categories.PREFERENCES, record)
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
          .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
          .then((response) => {
            const s3Record = response[0]
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
          const putRequest = requestUtil.put(proto.categories.PREFERENCES, record)
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
                .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
                .then((response) => {
                  t.equals(response.length, 3, t.name)
                  const s3Record0 = response[0]
                  const s3Record1 = response[1]
                  const s3Record2 = response[2]
                  t.equals(s3Record0.device.name, `pyramid at ${TIME_B}`)
                  t.equals(s3Record1.device.name, `pyramid at ${TIME_C}`)
                  t.equals(s3Record2.device.name, `pyramid at ${TIME_D}`)
                  testCanPutHistorySite(t)
                })
                .catch((error) => { t.fail(error) })
            })
            .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })
    }

    const testCanPutHistorySite = (t) => {
      const record = {
        action: 'CREATE',
        deviceId: new Uint8Array([0]),
        objectId: testHelper.newUuid(),
        historySite: {
          location: `https://brave.com?q=${'x'.repeat(4048)}`,
          title: 'lulz',
          lastAccessedTime: 1480000000 * 1000,
          creationTime: 1480000000 * 1000
        }
      }

      t.test('#put history site: large URL (multipart)', (t) => {
        t.plan(2)
        timekeeper.freeze(1480000000 * 1000)
        requestUtil.put(proto.categories.HISTORY_SITES, record)
          .then((response) => {
            timekeeper.reset()
            t.pass(`${t.name} resolves`)
            testCanRetrieve(t)
          })
          .catch((error) => { t.fail(error) })
      })

      const testCanRetrieve = (t) => {
        t.test(`${t.name}`, (t) => {
          t.plan(5)
          requestUtil.list(proto.categories.HISTORY_SITES)
            .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
            .then((response) => {
              const s3Record = response[0]
              // FIXME: Should this deserialize to 'CREATE' ?
              t.equals(s3Record.action, 0, `${t.name}: action`)
              t.deepEquals(s3Record.deviceId, record.deviceId, `${t.name}: deviceId`)
              t.deepEquals(s3Record.objectId, record.objectId, `${t.name}: objectId`)
              t.deepEquals(s3Record.historySite, record.historySite, `${t.name}: historySite.location`)
              testCanDeleteHistorySites(t)
            })
            .catch((error) => { t.fail(error) })
        })
      }
    }

    const testCanDeleteHistorySites = (t) => {
      t.test('#deleteCategory historySites', (t) => {
        t.plan(2)
        requestUtil.deleteCategory(proto.categories.HISTORY_SITES)
          .then((_response) => {
            requestUtil.list(proto.categories.HISTORY_SITES)
              .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
              .then((response) => {
                t.equals(response.length, 0, `${t.name} works`)
                testCanDeletePreferences(t)
              })
              .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })
    }

    const testCanDeletePreferences = (t) => {
      t.test('#deleteCategory preferences', (t) => {
        t.plan(2)
        requestUtil.deleteCategory(proto.categories.PREFERENCES)
          .then((_response) => {
            requestUtil.list(proto.categories.PREFERENCES)
              .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
              .then((response) => {
                t.equals(response.length, 0, `${t.name} works`)
                testCanDeleteSiteSettings(t)
              })
              .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })
    }

    const testCanDeleteSiteSettings = (t) => {
      t.test('#deleteSiteSettings', (t) => {
        t.plan(3)

        const deviceRecord = {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          device: {name: 'coconut pyramid'}
        }
        const siteSettingRecord = {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          siteSetting: {hostPattern: 'https://google.com', shieldsUp: true}
        }

        Promise.all([
          requestUtil.put(proto.categories.PREFERENCES, deviceRecord),
          requestUtil.put(proto.categories.PREFERENCES, siteSettingRecord)
        ])
        .then(() => {
          requestUtil.deleteSiteSettings()
            .then(() => {
              requestUtil.list(proto.categories.PREFERENCES)
                .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
                .then((response) => {
                  t.equals(response.length, 1, `${t.name} deletes records`)
                  const s3Record = response[0]
                  t.assert(s3Record.device && s3Record.device.name, `${t.name} preserves device records`)
                  testCanLimitResponse(t)
                })
                .catch((error) => { t.fail(error) })
            })
            .catch((error) => { t.fail(error) })
        })
        .catch((error) => { t.fail(error) })
      })
    }

    const testCanLimitResponse = (t) => {
      t.test('limitResponse undefined', (t) => {
        t.plan(3)
        const siteSettingRecord = {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          siteSetting: {hostPattern: 'https://google.com', shieldsUp: true}
        }

        requestUtil.put(proto.categories.PREFERENCES, siteSettingRecord)
          .then(() => {
            requestUtil.list(proto.categories.PREFERENCES, 0)
              .then((s3Objects) => {
                t.assert(s3Objects.isTruncated === false, `${t.name} has false isTruncated value`)
                t.assert(s3Objects.contents.length === 2, `${t.name} has two records`)
                testCanLimitResponseToZero(t)
              })
              .catch((error) => t.fail(error))
          })
          .catch((error) => t.fail(error))
      })
    }

    const testCanLimitResponseToZero = (t) => {
      t.test('limitResponse to 0', (t) => {
        t.plan(3)
        requestUtil.list(proto.categories.PREFERENCES, 0, 0)
          .then((s3Objects) => {
            t.assert(s3Objects.isTruncated === false, `${t.name} has false isTruncated value`)
            t.assert(s3Objects.contents.length === 2, `${t.name} has two records`)
            testCanLimitResponseToOne(t)
          })
          .catch((error) => t.fail(error))
      })
    }

    const testCanLimitResponseToOne = (t) => {
      t.test('limitResponse to 1', (t) => {
        t.plan(2)
        requestUtil.list(proto.categories.PREFERENCES, 0, 1)
          .then((s3Objects) => {
            t.assert(s3Objects.isTruncated === true, `${t.name} has true isTruncated value`)
            t.assert(s3Objects.contents.length === 1, `${t.name} has one record`)
          })
          .catch((error) => t.fail(error))
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
              .then((response) => { t.pass(t.name) })
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
            .then((response) => { t.pass(t.name) })
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
          requestUtil.put(proto.categories.PREFERENCES, record)
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
