const test = require('tape')
const testHelper = require('../testHelper')
const clientTestHelper = require('./testHelper')
const Serializer = require('../../lib/serializer')
const RequestUtil = require('../../client/requestUtil')
const proto = require('../../client/constants/proto')

test('deviceId V2 migration', (t) => {
  t.test('constructor', (t) => {
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
        for (const arg of requiredArgs) {
          const lessArgs = Object.assign({}, args)
          lessArgs[arg] = undefined
          t.throws(() => { return new RequestUtil(lessArgs) }, `requires ${arg}`)
        }

        const requestUtil = new RequestUtil(args)
        requestUtil.createAndSubscribeSQSForTest('1')
          .then(() => {
            t.pass('can instantiate requestUtil')
            t.test('prototype', (t) => {
              setTimeout(() => {
                testPrototype(t, requestUtil, data.keys)
              }, 5000)
            })
          }).catch((error) => { t.end(error) })
      }).catch((error) => { t.end(error) })
    })
  })

  const testPrototype = (t, requestUtil, keys) => {
    test.onFinish(() => {
      requestUtil.deleteUser()
        .then(() => {
          requestUtil.purgeUserQueue()
        })
        .catch((error) => { console.log(`Cleanup failed: ${error}`) })
    })

    const record = {
      action: 'CREATE',
      deviceId: new Uint8Array([0]),
      objectId: testHelper.newUuid(),
      bookmark: {
        site: {
          location: `https://brave.com?q=${'x'.repeat(4)}`,
          title: 'Brave',
          lastAccessedTime: 1480000000 * 1000,
          creationTime: 1480000000 * 1000
        },
        isFolder: false,
        hideInToolbar: false,
        order: '1.0.0.1'
      }
    }
    const record2 = {
      action: 'CREATE',
      deviceId: new Uint8Array([0]),
      objectId: testHelper.newUuid(),
      bookmark: {
        site: {
          location: `https://brave.com?q=${'y'.repeat(4)}`,
          title: 'Brave2',
          lastAccessedTime: 1480000000 * 1000,
          creationTime: 1480000000 * 1000
        },
        isFolder: false,
        hideInToolbar: false,
        order: '1.0.0.2'
      }
    }
    t.test('#put record before migration', (t) => {
      requestUtil.put(proto.categories.BOOKMARKS, record)
        .then((response) => {
          t.pass(`${t.name} resolves`)
          requestUtil.createAndSubscribeSQS('1', 'beef12')
            .then(() => {
              setTimeout(() => {
                t.pass('subscribe to new SQS queue')
                testCanListFromOldQueue(t)
              }, 5000)
            }).catch((error) => { t.end(error) })
        })
        .catch((error) => { t.fail(error) })
    })
    const testCanListFromOldQueue = (t) => {
      t.test('can list notification from old SQS queue', (t) => {
        const currentTime = new Date().getTime()
        requestUtil.list(proto.categories.BOOKMARKS, currentTime, 0, '', currentTime)
          .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
          .then((response) => {
            t.equals(response.length, 1)
            const s3Record = response[0].record
            // FIXME: Should this deserialize to 'CREATE' ?
            t.equals(s3Record.action, 0, `${t.name}: action`)
            t.deepEquals(s3Record.deviceId, record.deviceId, `${t.name}: deviceId`)
            t.deepEquals(s3Record.objectId, record.objectId, `${t.name}: objectId`)
            t.deepEquals(s3Record.bookmark.site, record.bookmark.site, `${t.name}: bookmark.site`)
            t.deepEquals(s3Record.bookmark.isFolder, record.bookmark.isFolder, `${t.name}: bookmark.isFolder`)
            t.deepEquals(s3Record.bookmark.hideInToolbar, record.bookmark.hideInToolbar, `${t.name}: bookmark.hideInToolbar`)
            t.deepEquals(s3Record.bookmark.order, record.bookmark.order, `${t.name}: bookmark.order`)
            putRecordAfterMigration(t)
          })
          .catch((error) => { t.fail(error) })
      })
    }
    const putRecordAfterMigration = (t) => {
      requestUtil.put(proto.categories.BOOKMARKS, record2)
        .then((response) => {
          setTimeout(() => {
            testCanListFromBothQueues(t)
          }, 5000)
        })
        .catch((error) => { t.fail(error) })
    }
    const testCanListFromBothQueues = (t) => {
      t.test('can list notifications from new and old SQS queues', (t) => {
        const currentTime = new Date().getTime()
        requestUtil.list(proto.categories.BOOKMARKS, currentTime, 0, '', currentTime)
          .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
          .then((response) => {
            t.equals(response.length, 1)
            const s3Record = response[0].record
            // FIXME: Should this deserialize to 'CREATE' ?
            t.equals(s3Record.action, 0, `${t.name}: action`)
            t.deepEquals(s3Record.deviceId, record2.deviceId, `${t.name}: deviceId`)
            t.deepEquals(s3Record.objectId, record2.objectId, `${t.name}: objectId`)
            t.deepEquals(s3Record.bookmark.site, record2.bookmark.site, `${t.name}: bookmark.site`)
            t.deepEquals(s3Record.bookmark.isFolder, record2.bookmark.isFolder, `${t.name}: bookmark.isFolder`)
            t.deepEquals(s3Record.bookmark.hideInToolbar, record2.bookmark.hideInToolbar, `${t.name}: bookmark.hideInToolbar`)
            t.deepEquals(s3Record.bookmark.order, record2.bookmark.order, `${t.name}: bookmark.order`)
            t.end()
          })
      })
    }
  }
})
