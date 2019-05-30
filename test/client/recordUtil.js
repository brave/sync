const test = require('tape')
const testHelper = require('../testHelper')
const timekeeper = require('timekeeper')
const proto = require('../../client/constants/proto')
const recordUtil = require('../../client/recordUtil')
const Serializer = require('../../lib/serializer')

const Record = (props) => {
  const baseProps = {
    action: proto.actions.CREATE,
    deviceId: new Uint8Array([0]),
    objectId: testHelper.newUuid()
  }
  return Object.assign({}, baseProps, props)
}
const CreateRecord = (props) => {
  return Record(Object.assign({action: proto.actions.CREATE}, props))
}
const UpdateRecord = (props) => {
  return Record(Object.assign({action: proto.actions.UPDATE}, props))
}
const DeleteRecord = (props) => {
  return Record(Object.assign({action: proto.actions.DELETE}, props))
}

const timestampMs = 1480004209001
const siteProps = {
  location: 'https://www.jisho.org',
  title: 'jisho',
  customTitle: '辞書',
  lastAccessedTime: timestampMs,
  creationTime: timestampMs,
  favicon: 'foobar'
}
const props = {
  bookmark: {
    isFolder: false,
    hideInToolbar: true,
    site: siteProps
  },
  historySite: siteProps,
  siteSetting: {
    fingerprintingProtection: false,
    hostPattern: 'https?://soundcloud.com',
    shieldsUp: false, // yolo
    noScript: false,
    zoomLevel: 2.5
  }
}
const updateSiteProps = {customTitle: 'a ball pit filled with plush coconuts'}

const recordBookmark = Record({objectData: 'bookmark', bookmark: props.bookmark})
const recordHistorySite = Record({objectData: 'historySite', historySite: siteProps})
const recordSiteSetting = Record({objectData: 'siteSetting', siteSetting: props.siteSetting})
const recordDevice = Record({objectData: 'device', device: {name: 'test pyramid'}})
const baseRecords = [recordBookmark, recordHistorySite, recordSiteSetting]

const updateBookmark = UpdateRecord({
  objectId: recordBookmark.objectId,
  objectData: 'bookmark',
  bookmark: {site: updateSiteProps}
})
const updateHistorySite = UpdateRecord({
  objectId: recordHistorySite.objectId,
  objectData: 'historySite',
  historySite: updateSiteProps
})
const updateSiteSetting = UpdateRecord({
  objectId: recordSiteSetting.objectId,
  objectData: 'siteSetting',
  siteSetting: {shieldsUp: true}
})

test('recordUtil.resolve', (t) => {
  t.plan(14)

  const forRecordsWithAction = (t, action, callback) => {
    t.plan(baseRecords.length)
    for (let record of baseRecords) {
      record.action = action
      const existingObject = Object.assign({}, record, {action: proto.actions.CREATE})
      callback(record, existingObject)
    }
  }

  t.test('CREATE, existing object -> null', (t) => {
    forRecordsWithAction(t, proto.actions.CREATE, (record, existingObject) => {
      const resolved = recordUtil.resolve(record, existingObject)
      t.equals(resolved, null, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('CREATE, no existing object -> identity', (t) => {
    forRecordsWithAction(t, proto.actions.CREATE, (record) => {
      const resolved = recordUtil.resolve(record, undefined)
      t.deepEquals(resolved, record, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('DELETE, existing object -> identity', (t) => {
    forRecordsWithAction(t, proto.actions.DELETE, (record, existingObject) => {
      const resolved = recordUtil.resolve(record, existingObject)
      t.deepEquals(resolved, record, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('DELETE siteSetting, existing -> overlapping props', (t) => {
    t.plan(1)
    const deleteSiteSetting = DeleteRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        hostPattern: 'https?://soundcloud.com',
        fingerprintingProtection: true, // In recordSiteSetting.siteSetting
        httpsEverywhere: false // Not in recordSiteSetting.siteSetting
      }
    })
    const expected = DeleteRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        fingerprintingProtection: true,
        hostPattern: 'https?://soundcloud.com'
      }
    })
    const resolved = recordUtil.resolve(deleteSiteSetting, recordSiteSetting)
    t.deepEquals(resolved, expected, `${t.name}`)
  })

  t.test('DELETE siteSetting, existing, no common props -> null', (t) => {
    t.plan(1)
    const deleteSiteSetting = DeleteRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        hostPattern: 'https?://soundcloud.com',
        httpsEverywhere: false // Not in recordSiteSetting.siteSetting
      }
    })
    const resolved = recordUtil.resolve(deleteSiteSetting, recordSiteSetting)
    t.equals(resolved, null, `${t.name}`)
  })

  t.test('DELETE site, existing, no props -> identity', (t) => {
    t.plan(1)
    const deleteSite = DeleteRecord({
      objectId: recordBookmark.objectId,
      deviceId: [0],
      objectData: 'bookmark',
      bookmark: {}
    })
    const resolved = recordUtil.resolve(deleteSite, recordBookmark)
    t.equals(resolved, deleteSite, `${t.name}`)
  })

  t.test('DELETE site, no existing object, no props -> null', (t) => {
    t.plan(1)
    const deleteSite = DeleteRecord({
      objectId: recordHistorySite.objectId,
      deviceId: [0],
      objectData: 'historySite',
      historySite: {}
    })
    const resolved = recordUtil.resolve(deleteSite, null)
    t.equals(resolved, null, `${t.name}`)
  })

  t.test('DELETE, no existing object -> null', (t) => {
    forRecordsWithAction(t, proto.actions.DELETE, (record) => {
      const resolved = recordUtil.resolve(record, undefined)
      t.equals(resolved, null, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('UPDATE, existing object with same props -> null', (t) => {
    forRecordsWithAction(t, proto.actions.UPDATE, (record, existingObject) => {
      const resolved = recordUtil.resolve(record, existingObject)
      t.equals(resolved, null, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('UPDATE, existing object with same props reordered -> null', (t) => {
    t.plan(1)
    const siteSettingReordered = UpdateRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        shieldsUp: false, // yolo
        fingerprintingProtection: false,
        hostPattern: 'https?://soundcloud.com',
        zoomLevel: 2.5,
        noScript: false
      }
    })
    const resolved = recordUtil.resolve(siteSettingReordered, recordSiteSetting)
    t.equals(resolved, null, `${t.name}: object props are reordered`)
  })

  t.test('UPDATE, existing object with different props -> identity', (t) => {
    t.plan(3)
    const resolvedBookmark = recordUtil.resolve(updateBookmark, recordBookmark)
    t.deepEquals(resolvedBookmark, updateBookmark, `${t.name}: bookmark`)
    const resolvedHistorySite = recordUtil.resolve(updateHistorySite, recordHistorySite)
    t.deepEquals(resolvedHistorySite, updateHistorySite, `${t.name}: historySite`)
    const resolvedSiteSetting = recordUtil.resolve(updateSiteSetting, recordSiteSetting)
    t.deepEquals(resolvedSiteSetting, updateSiteSetting, `${t.name}: siteSetting`)
  })

  t.test('UPDATE siteSetting, existing -> only changed props', (t) => {
    t.plan(1)
    const updateSiteSetting = UpdateRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        hostPattern: 'https?://soundcloud.com',
        fingerprintingProtection: false, // Same as recordSiteSetting.siteSetting
        httpsEverywhere: false // Not in recordSiteSetting.siteSetting
      }
    })
    const expected = UpdateRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        hostPattern: 'https?://soundcloud.com',
        httpsEverywhere: false
      }
    })
    const resolved = recordUtil.resolve(updateSiteSetting, recordSiteSetting)
    t.deepEquals(resolved, expected, `${t.name}`)
  })

  t.test('UPDATE siteSetting, existing, no changed props -> null', (t) => {
    t.plan(1)
    const updateSiteSetting = UpdateRecord({
      objectId: recordSiteSetting.objectId,
      objectData: 'siteSetting',
      siteSetting: {
        hostPattern: 'https?://soundcloud.com',
        fingerprintingProtection: false // Same as recordSiteSetting.siteSetting
      }
    })
    const resolved = recordUtil.resolve(updateSiteSetting, recordSiteSetting)
    t.equals(resolved, null, `${t.name}`)
  })

  t.test('UPDATE, no existing object', (t) => {
    t.plan(8)
    const time = 1480000000 * 1000
    const url = 'https://jisho.org'

    const resolveToNull = (t, recordProps, message) => {
      t.plan(1)
      const record = Record(
        Object.assign({}, recordProps, {action: proto.actions.UPDATE})
      )
      const resolvedRecord = recordUtil.resolve(record)
      t.equals(resolvedRecord, null, message)
    }

    const resolveToCreate = (t, recordProps, resolvedProps, message) => {
      t.plan(1)
      const record = Record(
        Object.assign({}, recordProps, {action: proto.actions.UPDATE})
      )
      const expectedRecord = Record(Object.assign(
        {},
        resolvedProps,
        {
          action: proto.actions.CREATE,
          deviceId: record.deviceId,
          objectId: record.objectId
        }
      ))

      timekeeper.freeze(time)
      const resolvedRecord = recordUtil.resolve(record)
      timekeeper.reset()
      t.deepEquals(resolvedRecord, expectedRecord, message)
    }

    t.test(`${t.name}, historySite, .customTitle -> null`, (t) => {
      const recordProps = {objectData: 'historySite', historySite: {customTitle: 'pyramid'}}
      resolveToNull(t, recordProps, t.name)
    })

    t.test(`${t.name}, historySite, .location -> create`, (t) => {
      const recordProps = {objectData: 'historySite', historySite: {location: url}}
      const resolvedProps = {
        historySite: {
          location: url,
          title: '',
          customTitle: url,
          lastAccessedTime: time,
          creationTime: time,
          favicon: ''
        },
        objectData: 'historySite'
      }
      resolveToCreate(t, recordProps, resolvedProps, t.name)
    })

    t.test(`${t.name}, bookmark, .site.customTitle -> null`, (t) => {
      const recordProps = {
        objectData: 'bookmark',
        bookmark: {site: {customTitle: 'i like turtles'}}
      }
      resolveToNull(t, recordProps, t.name)
    })

    t.test(`${t.name}, bookmark, .site.location -> create bookmark`, (t) => {
      const recordProps = {
        objectData: 'bookmark',
        bookmark: {site: {location: url}}
      }
      const resolvedProps = {
        bookmark: {
          site: {
            location: url,
            title: '',
            customTitle: url,
            lastAccessedTime: time,
            creationTime: time,
            favicon: ''
          },
          isFolder: false
        },
        objectData: 'bookmark'
      }
      resolveToCreate(t, recordProps, resolvedProps, t.name)
    })

    t.test(`${t.name}, bookmark, .isFolder .site.customTitle -> create folder`, (t) => {
      const recordProps = {
        bookmark: {
          site: {customTitle: 'sweet title'},
          isFolder: true
        },
        objectData: 'bookmark'
      }
      resolveToCreate(t, recordProps, recordProps, t.name)
    })

    t.test(`${t.name}, bookmark, .isFolder, .site.title -> create folder`, (t) => {
      const recordProps = {
        bookmark: {
          site: {title: 'salty title'},
          isFolder: true
        },
        objectData: 'bookmark'
      }
      resolveToCreate(t, recordProps, recordProps, t.name)
    })

    t.test(`${t.name}, siteSetting, .safeBrowsing -> null`, (t) => {
      const recordProps = {
        objectData: 'siteSetting',
        siteSetting: {safeBrowsing: false}
      }
      resolveToNull(t, recordProps, t.name)
    })

    t.test(`${t.name}, siteSetting, .hostPattern -> create`, (t) => {
      const recordProps = {
        objectData: 'siteSetting',
        siteSetting: {hostPattern: url, noScript: false}
      }
      const resolvedProps = {
        siteSetting: {
          hostPattern: url,
          noScript: false
        },
        objectData: 'siteSetting'
      }
      resolveToCreate(t, recordProps, resolvedProps, t.name)
    })
  })
})

test('recordUtil.resolveRecords()', (t) => {
  t.plan(5)

  t.test(`${t.name} resolves same data cross-platform on laptop and android`, (t) => {
    t.plan(1)
    // Generated by logging Android input to RESOLVE_SYNC_RECORDS
    const androidRecordsAndExistingObjects = require('./fixtures/resolveAndroid').data
    // Generated by logging browser-laptop input to RESOLVE_SYNC_RECORDS
    const laptopRecordsAndExistingObjects = require('./fixtures/resolveLaptop').data
    const resolvedLaptop = recordUtil.resolveRecords(laptopRecordsAndExistingObjects)
    resolvedLaptop.forEach((record) => {
      // Ignore syncTimestamp on laptop since Android doesn't use it
      delete record.syncTimestamp
    })
    const resolvedAndroid = recordUtil.resolveRecords(androidRecordsAndExistingObjects)
    t.deepEquals(resolvedLaptop, resolvedAndroid, `resolves same bookmarks on android and laptop`)
  })

  t.test(`${t.name} takes [ [{syncRecord}, {existingObject || null}], ... ] and returns resolved records [{syncRecord}, ...]`, (t) => {
    t.plan(1)
    const input = [
      [updateBookmark, recordBookmark],
      [recordSiteSetting, null]
    ]
    const resolved = recordUtil.resolveRecords(input)
    const expected = [updateBookmark, recordSiteSetting]
    t.deepEquals(resolved, expected, t.name)
  })

  t.test(`${t.name} sequential Updates should become no op`, (t) => {
    t.plan(1)
    const update1 = UpdateRecord({
      objectId: recordBookmark.objectId,
      objectData: 'bookmark',
      bookmark: { site: siteProps }
    })
    const update2 = updateBookmark
    const existingObject = Record({
      objectId: recordBookmark.objectId,
      objectData: 'bookmark',
      bookmark: { site: Object.assign({}, siteProps, updateSiteProps) }
    })
    const input = [
      [update1, existingObject],
      [update2, existingObject]
    ]
    const resolved = recordUtil.resolveRecords(input)
    t.deepEquals(resolved, [], t.name)
  })

  t.test(`${t.name} Create + Update of a new object should resolve to a single Create`, (t) => {
    t.plan(1)
    const expectedRecord = CreateRecord({
      objectId: recordBookmark.objectId,
      objectData: 'bookmark',
      bookmark: Object.assign(
        {},
        props.bookmark,
        { site: Object.assign({}, siteProps, updateSiteProps) }
      )
    })
    const input = [[recordBookmark, null], [updateBookmark, null]]
    const resolved = recordUtil.resolveRecords(input)
    t.deepEquals(resolved, [expectedRecord], t.name)
  })

  t.test(`${t.name} resolves bookmark records with same parent folder`, (t) => {
    t.plan(1)
    const record = {
      action: 1,
      deviceId: [0],
      objectId: [16, 84, 219, 81, 33, 13, 44, 121, 211, 208, 1, 203, 114, 18, 215, 244],
      objectData: 'bookmark',
      bookmark: {
        site: {
          location: 'https://www.bobsclamhut.com/',
          title: "Bob's Clam Hut",
          customTitle: 'best seafood in Kittery',
          favicon: '',
          lastAccessedTime: 0,
          creationTime: 0
        },
        isFolder: false,
        parentFolderObjectId: [119, 148, 37, 242, 165, 20, 119, 15, 53, 57, 223, 116, 155, 99, 9, 128]
      }
    }
    const existingObject = {
      action: 1,
      deviceId: [12],
      objectId: [16, 84, 219, 81, 33, 13, 44, 121, 211, 208, 1, 203, 114, 18, 215, 244],
      objectData: 'bookmark',
      bookmark: {
        site: {
          location: 'https://www.bobsclamhut.com/',
          title: "Bob's Clam Hut",
          customTitle: '',
          favicon: '',
          lastAccessedTime: 0,
          creationTime: 0
        },
        isFolder: false,
        parentFolderObjectId: [119, 148, 37, 242, 165, 20, 119, 15, 53, 57, 223, 116, 155, 99, 9, 128]
      }
    }
    const recordsAndExistingObjects = [[record, existingObject]]
    const resolved = recordUtil.resolveRecords(recordsAndExistingObjects)
    t.deepEquals(resolved, [record], t.name)
  })
})

test('recordUtil.syncRecordAsJS()', (t) => {
  t.plan(4)
  Serializer.init().then((serializer) => {
    const time = 1480000000 * 1000
    const baseProps = {
      action: proto.actions.CREATE,
      deviceId: new Uint8Array([0]),
      objectId: testHelper.newUuid()
    }
    const conversionEquals = (recordProps) => {
      const props = Object.assign({}, baseProps, recordProps)
      const encodedRecord = serializer.syncRecordToByteArray(props)
      const decodedRecord = serializer.byteArrayToSyncRecord(encodedRecord)
      const recordJS = recordUtil.syncRecordAsJS(decodedRecord)
      t.deepEquals(recordJS, props, `${t.name} ${recordProps.objectData}`)
    }

    const site = serializer.api.SyncRecord.Site.create({
      creationTime: time,
      customTitle: 'cool',
      lastAccessedTime: time,
      favicon: 'foobar',
      location: 'https://jisho.org',
      title: 'jisho'
    })
    conversionEquals({ objectData: 'historySite', historySite: site })

    const bookmark = serializer.api.SyncRecord.Bookmark.create({
      site,
      isFolder: false,
      parentFolderObjectId: testHelper.newUuid(),
      hideInToolbar: true
    })
    conversionEquals({ objectData: 'bookmark', bookmark })

    const siteSetting = serializer.api.SyncRecord.SiteSetting.create({
      hostPattern: 'https://jisho.org', httpsEverywhere: false, ledgerPayments: false, ledgerPaymentsShown: false, noScript: false, safeBrowsing: false, shieldsUp: false, zoomLevel: 0.5
    })
    conversionEquals({ objectData: 'siteSetting', siteSetting })

    const device = serializer.api.SyncRecord.Device.create({
      name: 'mobile pyramid'
    })
    conversionEquals({ objectData: 'device', device })
  })
})

test('recordUtil.getRecordCategory()', (t) => {
  t.plan(8)
  const brokenRecord = Record({})
  t.equals(recordUtil.getRecordCategory(recordBookmark), '0')
  t.equals(recordUtil.getRecordCategory(updateBookmark), '0')
  t.equals(recordUtil.getRecordCategory(recordHistorySite), '1')
  t.equals(recordUtil.getRecordCategory(updateHistorySite), '1')
  t.equals(recordUtil.getRecordCategory(recordSiteSetting), '2')
  t.equals(recordUtil.getRecordCategory(updateSiteSetting), '2')
  t.equals(recordUtil.getRecordCategory(recordDevice), '2')
  t.equals(recordUtil.getRecordCategory(brokenRecord), undefined)
})
