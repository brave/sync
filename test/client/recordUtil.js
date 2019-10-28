const test = require('tape')
const testHelper = require('../testHelper')
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

const bookmarkRecordEx = (action, timestamp) => {
  let bookmark = Record({objectData: 'bookmark', bookmark: props.bookmark})
  bookmark.action = action
  if (timestamp) {
    bookmark.syncTimestamp = timestamp
  }
  return bookmark
}

test('recordUtil.getThisPairWinner', (t) => {
  t.plan(3)
  t.test('DELETE wins over CREATE/UPDATE/null', (t) => {
    t.plan(5)
    const bookmarkDelete = bookmarkRecordEx(proto.actions.DELETE, 1571929910002)
    const bookmarkCreate = bookmarkRecordEx(proto.actions.CREATE, 1571929910002)
    const bookmarkUpdate = bookmarkRecordEx(proto.actions.UPDATE, 1571929910002)

    const winner = recordUtil.getThisPairWinner([bookmarkDelete, bookmarkCreate])
    t.deepEquals(winner, bookmarkDelete, t.name)
    const winner2 = recordUtil.getThisPairWinner([bookmarkDelete, bookmarkUpdate])
    t.deepEquals(winner2, bookmarkDelete, t.name)
    const winner3 = recordUtil.getThisPairWinner([bookmarkDelete, null])
    t.deepEquals(winner3, bookmarkDelete, t.name)

    const winner4 = recordUtil.getThisPairWinner([bookmarkCreate, bookmarkDelete])
    t.deepEquals(winner4, bookmarkDelete, t.name)
    const winner5 = recordUtil.getThisPairWinner([bookmarkUpdate, bookmarkDelete])
    t.deepEquals(winner5, bookmarkDelete, t.name)
  })

  t.test('Latest wins', (t) => {
    t.plan(2)
    const latest = bookmarkRecordEx(proto.actions.UPDATE, 1571929910002)
    const earliest = bookmarkRecordEx(proto.actions.UPDATE, 1571929910001)

    t.test('Remote wins if latest', (t) => {
      t.plan(1)
      const remote = latest
      const local = earliest
      const winner = recordUtil.getThisPairWinner([remote, local])
      t.deepEquals(winner, remote, t.name)
    })
    t.test('Local wins if latest', (t) => {
      t.plan(1)
      const remote = earliest
      const local = latest
      const winner = recordUtil.getThisPairWinner([remote, local])
      t.deepEquals(winner, local, t.name)
    })
  })

  t.test('When timestamp is not specified, wins remote', (t) => {
    t.plan(3)
    const remote = bookmarkRecordEx(proto.actions.CREATE)
    const local = bookmarkRecordEx(proto.actions.UPDATE)

    t.equals(!!remote.syncTimestamp, false)
    t.equals(!!local.syncTimestamp, false)

    const winner = recordUtil.getThisPairWinner([remote, local])
    t.deepEquals(winner, remote, t.name)
  })
})

test('recordUtil.keepMostRecent', (t) => {
  t.plan(1)
  const recordWithObjectId = (objectId, title) => {
    let record = bookmarkRecordEx(proto.actions.UPDATE)
    record.objectId = objectId
    record.bookmark.site.title = title
    return record
  }

  const id1 = [102, 169, 71, 255, 160, 7, 199, 37, 174, 1, 89, 148, 37, 235, 137, 188]
  const id2 = [57, 70, 144, 212, 237, 131, 12, 182, 117, 184, 46, 131, 46, 82, 113, 92]

  const obj1Local = recordWithObjectId(id1, 'title_1_local')
  const obj11 = recordWithObjectId(id1, 'title_11')
  const obj12 = recordWithObjectId(id1, 'title_12')
  const obj13 = recordWithObjectId(id1, 'title_13')

  const obj2Local = recordWithObjectId(id2, 'title_2_local')
  const obj21 = recordWithObjectId(id2, 'title_21')
  const obj22 = recordWithObjectId(id2, 'title_22')
  const obj23 = recordWithObjectId(id2, 'title_23')

  const result = recordUtil.keepMostRecent([
    [obj11, obj1Local], [obj21, obj2Local], [obj22, obj2Local],
    [obj12, obj1Local], [obj13, obj1Local], [obj23, obj2Local]
  ])

  t.deepEquals(result, [[obj13, obj1Local], [obj23, obj2Local]], t.name)
})

test('recordUtil.resolveRecords()', (t) => {
  t.plan(6)

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

  t.test(`${t.name} sequential Updates should become the latest update`, (t) => {
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
    t.deepEquals(resolved, [update2], t.name)
  })

  t.test(`${t.name} Create + Update of a new object should resolve to the latest Update`, (t) => {
    t.plan(1)
    const input = [[recordBookmark, null], [updateBookmark, null]]
    const resolved = recordUtil.resolveRecords(input)
    t.deepEquals(resolved, [updateBookmark], t.name)
  })

  t.test(`${t.name} Create + Delete of non-existing object should be resolve to last Delete`, (t) => {
    t.plan(1)
    var createBookmark = CreateRecord({
      objectId: recordBookmark.objectId,
      objectData: 'bookmark',
      bookmark: Object.assign(
        {},
        props.bookmark,
        { site: Object.assign({}, siteProps) }
      )
    })
    var deleteBookmark = DeleteRecord({
      objectId: recordBookmark.objectId,
      objectData: 'bookmark',
      bookmark: { site: siteProps }
    })
    const input = [[createBookmark, null], [deleteBookmark, null]]
    const resolved = recordUtil.resolveRecords(input)
    const expected = [deleteBookmark]
    t.deepEquals(resolved, expected, t.name)
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
