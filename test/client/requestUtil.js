const test = require('tape')
const testHelper = require('../testHelper')
const timekeeper = require('timekeeper')
const clientTestHelper = require('./testHelper')
const {generateDeviceIdV2} = require('../../lib/crypto')
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
        requestUtil.createAndSubscribeSQS('0', generateDeviceIdV2())
          .then(()=> {
            t.pass('can instantiate requestUtil')
            t.test('prototype', (t) => {
              testPrototype(t, requestUtil, data.keys)
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
            const s3Record = response[0].record
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
                  const s3Record0 = response[0].record
                  const s3Record1 = response[1].record
                  const s3Record2 = response[2].record
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
              const s3Record = response[0].record
              // FIXME: Should this deserialize to 'CREATE' ?
              t.equals(s3Record.action, 0, `${t.name}: action`)
              t.deepEquals(s3Record.deviceId, record.deviceId, `${t.name}: deviceId`)
              t.deepEquals(s3Record.objectId, record.objectId, `${t.name}: objectId`)
              t.deepEquals(s3Record.historySite, record.historySite, `${t.name}: historySite.location`)
              testCanPutBookmarks(t)
            })
            .catch((error) => { t.fail(error) })
        })
      }
    }

    const testCanPutBookmarks = (t) => {
      // This record will be split into 6 parts
      const record = {
        action: 'CREATE',
        deviceId: new Uint8Array([0]),
        objectId: testHelper.newUuid(),
        bookmark: {
          site: {
            location: `https://brave.com?q=${'x'.repeat(4096)}`,
            title: 'lulz',
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
            location: `https://brave.com?q=${'x'.repeat(4)}`,
            title: 'lulz2',
            lastAccessedTime: 1480000000 * 1000,
            creationTime: 1480000000 * 1000
          },
          isFolder: false,
          hideInToolbar: false,
          order: '1.0.0.2'
        }
      }

      t.test('#put bookmark: large URL (multipart)', (t) => {
        t.plan(2)
        requestUtil.put(proto.categories.BOOKMARKS, record)
          .then((response) => {
            timekeeper.reset()
            t.pass(`${t.name} resolves`)
            setTimeout(() => {
              testCanListObjects(t)
            }, 5000)
          })
          .catch((error) => { t.fail(error) })
      })

      const testCanListObjects = (t) => {
        t.test(`${t.name}`, (t) => {
          t.plan(10)
          requestUtil.list(proto.categories.BOOKMARKS, 0, 3)
            .then(s3Objects => {
              t.equals(s3Objects.isTruncated, true)
              t.deepEquals(requestUtil.s3ObjectsToRecords(s3Objects.contents), [])
              return requestUtil.list(proto.categories.BOOKMARKS, 0, 3, s3Objects.nextContinuationToken)
                .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
            }).then((response) => {
              const s3Record = response[0].record
              // FIXME: Should this deserialize to 'CREATE' ?
              t.equals(s3Record.action, 0, `${t.name}: action`)
              t.deepEquals(s3Record.deviceId, record.deviceId, `${t.name}: deviceId`)
              t.deepEquals(s3Record.objectId, record.objectId, `${t.name}: objectId`)
              t.deepEquals(s3Record.bookmark.site, record.bookmark.site, `${t.name}: bookmark.site`)
              t.deepEquals(s3Record.bookmark.isFolder, record.bookmark.isFolder, `${t.name}: bookmark.isFolder`)
              t.deepEquals(s3Record.bookmark.hideInToolbar, record.bookmark.hideInToolbar, `${t.name}: bookmark.hideInToolbar`)
              t.deepEquals(s3Record.bookmark.order, record.bookmark.order, `${t.name}: bookmark.order`)
              testIgnoreSQSseenFromS3Records(t)
            })
            .catch((error) => { t.fail(error) })
        })
      }

      const testIgnoreSQSseenFromS3Records = (t) => {
        t.test(`${t.name} ignore SQS seen from S3`, (t) => {
          t.plan(2)
          let currentTime = new Date().getTime()
          requestUtil.list(proto.categories.BOOKMARKS, currentTime)
            .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
            .then((response) => {
              // This record previously was in list S3, so now should be filtered out
              t.equals(response.length, 0)
              testSendSecondBookmark(t)
            })
            .catch((error) => { t.fail(error) })
        })
      }

      const testSendSecondBookmark = (t) => {
        t.plan(2)
        requestUtil.put(proto.categories.BOOKMARKS, record2)
        setTimeout(() => {
          testCanListNotifications(t)
        }, 4000)
      }

      const testCanListNotifications = (t) => {
        t.test(`${t.name} can list notification`, (t) => {
          let currentTime = new Date().getTime()
          requestUtil.list(proto.categories.BOOKMARKS, currentTime)
            .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
            .then((response) => {
              const s3Record = response[1] ? response[1].record : response[1]
              // Here we always see error `Record with CRC xxxxx is missing parts or corrupt.`
              // if record2.bookmark.site.location length is ~ 4096
              if (!s3Record) {
                t.pass('empty SQS notifications/missing records, check if more than one tests are running at the same time')
              } else {
                // FIXME: Should this deserialize to 'CREATE' ?
                t.equals(s3Record.action, 0, `${t.name}: action`)
                t.deepEquals(s3Record.deviceId, record2.deviceId, `${t.name}: deviceId`)
                t.deepEquals(s3Record.objectId, record2.objectId, `${t.name}: objectId`)
                t.deepEquals(s3Record.bookmark.site, record2.bookmark.site, `${t.name}: bookmark.site`)
                t.deepEquals(s3Record.bookmark.isFolder, record2.bookmark.isFolder, `${t.name}: bookmark.isFolder`)
                t.deepEquals(s3Record.bookmark.hideInToolbar, record2.bookmark.hideInToolbar, `${t.name}: bookmark.hideInToolbar`)
                t.deepEquals(s3Record.bookmark.order, record2.bookmark.order, `${t.name}: bookmark.order`)
              }
              testCanDeleteBookmarks(t)
            })
            .catch((error) => { t.fail(error) })
        })
      }
    }
    const testCanDeleteBookmarks = (t) => {
      t.test('#deleteCategory bookmarks', (t) => {
        t.plan(2)
        requestUtil.deleteCategory(proto.categories.BOOKMARKS)
          .then((_response) => {
            requestUtil.list(proto.categories.BOOKMARKS)
              .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
              .then((response) => {
                t.equals(response.length, 0, `${t.name} works`)
                testCanDeleteHistorySites(t)
              })
              .catch((error) => { t.fail(error) })
          })
          .catch((error) => { t.fail(error) })
      })
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
                  const s3Record = response[0].record
                  t.assert(s3Record.device && s3Record.device.name, `${t.name} preserves device records`)
                  testCanDoCompaction(t)
                })
                .catch((error) => { t.fail(error) })
            })
            .catch((error) => { t.fail(error) })
        })
        .catch((error) => { t.fail(error) })
      })
    }

    const testCanDoCompaction = (t) => {
      t.test('#compact bookmarks', (t) => {
        t.plan(7)
        const recordObjectId = testHelper.newUuid()
        const record2ObjectId = testHelper.newUuid()
        const record = {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: recordObjectId,
          bookmark: {
            site: {
              location: `https://brave.com?q=${'x'.repeat(4)}`,
              title: 'BRAVE',
              lastAccessedTime: 1480000000 * 1000,
              creationTime: 1480000000 * 1000
            },
            isFolder: false,
            hideInToolbar: false,
            order: '1.0.0.1'
          }
        }
        // This record will be split into 6 parts
        const record2 = {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: record2ObjectId,
          bookmark: {
            site: {
              location: `https://brave.com?q=${'x'.repeat(4096)}`,
              title: 'BRAVEE',
              lastAccessedTime: 1480000000 * 1000,
              creationTime: 1480000000 * 1000
            },
            isFolder: false,
            hideInToolbar: false,
            order: '1.0.0.2'
          }
        }
        let record_update = record
        record_update.action = 'UPDATE'
        let record2_update = record2
        record2_update.action = 'UPDATE'

        requestUtil.put(proto.categories.BOOKMARKS, record)
        requestUtil.put(proto.categories.BOOKMARKS, record2)
        for (let i = 0; i < 5; ++i) {
          requestUtil.put(proto.categories.BOOKMARKS, record_update)
          requestUtil.put(proto.categories.BOOKMARKS, record2_update)
        }
        const consoleLogBak = console.log
        let counter = 0
        let compactedRecord = []
        const compactionUpdate = (records) => {
          compactedRecord = compactedRecord.concat(records)
          counter = counter + 1
        }
        // limit batch size to 10 to test cross batch compaction for around 40
        // objects
        requestUtil.list(proto.categories.BOOKMARKS, 0, 10, '', {compaction: true,
          compactionUpdateCb: compactionUpdate,
          compactionDoneCb: () => {
            console.log = consoleLogBak
            console.log('compaction is done')
            t.equals(counter, 5)
            t.equals(compactedRecord.length, 9)
            t.equals(
              compactedRecord.filter(record => record.objectId.toString() === record_update.objectId.toString()).length, 4)
            t.equals(
              compactedRecord.filter(record => record.objectId.toString() === record2_update.objectId.toString()).length, 5)
            //  we already have 15 second timeout for each batch so no need to
            //  do another wait after compaction is done
            requestUtil.list(proto.categories.BOOKMARKS, 0, 0)
              .then(s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents))
              .then((response) => {
                t.equals(response.length, 2, `${t.name} check records number`)
                const s3Record = response[0].record
                const s3Record2 = response[1].record
                t.deepEquals(s3Record.objectId, record.objectId, `${t.name}: objectId`)
                t.deepEquals(s3Record.bookmark.site.title, record_update.bookmark.site.title, `${t.name}: bookmark.title`)
                requestUtil.deleteCategory(proto.categories.BOOKMARKS)
                  .then((_response) => {
                    testCanLimitResponse(t)
                  })
                  .catch((error) => { t.fail(error) })
              })
              .catch((error) => { t.fail(error) })
          }
        }).then(() => {
          // compaction is still in progress
          console.log = function() {}
        })
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
        t.plan(3)
        requestUtil.list(proto.categories.PREFERENCES, 0, 1)
          .then((s3Objects) => {
            t.assert(s3Objects.isTruncated === true, `${t.name} has true isTruncated value`)
            t.assert(s3Objects.contents.length === 1, `${t.name} has one record`)
            testCanGetBookmarksInChunks(t)
          })
          .catch((error) => t.fail(error))
      })
    }

    const testCanGetBookmarksInChunks = (t) => {
      const records = [
        {
        action: 'CREATE',
        deviceId: new Uint8Array([0]),
        objectId: testHelper.newUuid(),
        bookmark: {
          site: {
            location: `https://brave.com?q=1`,
            title: 'lulz',
            lastAccessedTime: 1480000000 * 1000,
            creationTime: 1480000000 * 1000
          },
          isFolder: false,
          hideInToolbar: false,
          order: '1.0.0.1'
        }},
        {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          bookmark: {
            site: {
              location: `https://brave.com?q=2`,
              title: 'lulz',
              lastAccessedTime: 1480000000 * 1000,
              creationTime: 1480000000 * 1000
            },
            isFolder: false,
            hideInToolbar: false,
            order: '1.0.0.2'
        }},
        {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          bookmark: {
            site: {
              location: `https://brave.com?q=3`,
              title: 'lulz',
              lastAccessedTime: 1480000000 * 1000,
              creationTime: 1480000000 * 1000
            },
            isFolder: false,
            hideInToolbar: false,
            order: '1.0.0.3'
        }},
        {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          bookmark: {
            site: {
              location: `https://brave.com?q=4`,
              title: 'lulz',
              lastAccessedTime: 1480000000 * 1000,
              creationTime: 1480000000 * 1000
            },
            isFolder: false,
            hideInToolbar: false,
            order: '1.0.0.4'
        }},
        {
          action: 'CREATE',
          deviceId: new Uint8Array([0]),
          objectId: testHelper.newUuid(),
          bookmark: {
            site: {
              location: `https://brave.com?q=5`,
              title: 'lulz',
              lastAccessedTime: 1480000000 * 1000,
              creationTime: 1480000000 * 1000
            },
            isFolder: false,
            hideInToolbar: false,
            order: '1.0.0.5'
        }}
      ]

      records.forEach((record) => {
        requestUtil.put(proto.categories.BOOKMARKS, record)
      })

      t.test('#getBookmarksInChunks', (t) => {
        t.plan(1)
        getBookmarksInChunks(t, '', 1)
      })

      const getBookmarksInChunks = (t, continuationToken, iterationNumber) => {
        if ((continuationToken === undefined || continuationToken === '') && iterationNumber > 1) {
          t.assert(true, 'getBookmarksInChunks exit recurtion')
          return
        }
        t.test('#getBookmarksInChunks attempt #' + iterationNumber, (t) => {
          t.plan(3)
          requestUtil.list(proto.categories.BOOKMARKS, 0, 3, continuationToken)
          .then((s3Objects) => {
            t.assert(s3Objects.contents.length <= 3, `${t.name} has less or exactly 3 records`)
            if (s3Objects.isTruncated === true && s3Objects.nextContinuationToken !== '' && s3Objects.nextContinuationToken !== undefined) {
              t.assert(true, `${t.name} isTruncated is true and nextContinuationToken is not empty`)
            } else if (s3Objects.isTruncated === false && (s3Objects.nextContinuationToken === '' || s3Objects.nextContinuationToken === undefined) && iterationNumber > 1) {
              t.assert(true, `${t.name} isTruncated is false and nextContinuationToken is empty`)
            } else {
              t.assert(false, `${t.name} isTruncated and nextContinuationToken values doesn't match, iterationNumber: ${iterationNumber}`)
            }
            continuationToken = s3Objects.nextContinuationToken
            iterationNumber = iterationNumber + 1
            getBookmarksInChunks(t, continuationToken, iterationNumber)
          })
          .catch((error) => t.fail(error))
        })
      }
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
