const test = require('tape')
const testHelper = require('../testHelper')
const timekeeper = require('timekeeper')
const proto = require('../../client/constants/proto')
const recordUtil = require('../../client/recordUtil')

test('recordUtil.resolve', (t) => {
  t.plan(6)
  const Record = (props) => {
    const baseProps = {
      deviceId: new Uint8Array([0]),
      objectId: testHelper.uuid()
    }
    return Object.assign({}, baseProps, props)
  }

  const timestampMs = 1480004209001
  const siteProps = {
    location: 'https://www.jisho.org',
    title: 'jisho',
    customTitle: '辞書',
    lastAccessedTime: timestampMs,
    creationTime: timestampMs
  }
  const props = {
    bookmark: {
      isFolder: false,
      site: siteProps
    },
    historySite: siteProps,
    siteSetting: {
      fingerprintingProtection: false,
      hostPattern: 'https?://soundcloud.com',
      shieldsUp: true,
      noScript: false,
      zoomLevel: 2.5
    }
  }

  const recordBookmark = Record({objectData: 'bookmark', bookmark: props.bookmark})
  const recordHistorySite = Record({objectData: 'historySite', historySite: siteProps})
  const recordSiteSetting = Record({objectData: 'siteSetting', siteSetting: props.siteSetting})
  const baseRecords = [recordBookmark, recordHistorySite, recordSiteSetting]

  const forRecordsWithAction = (t, action, callback) => {
    t.plan(baseRecords.length)
    for (let record of baseRecords) {
      record.action = action
      const existingObject = Object.assign({}, record, {action: proto.actions.CREATE})
      // const existingObject = props[record.objectData]
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
      t.equals(resolved, record, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('DELETE, existing object -> identity', (t) => {
    forRecordsWithAction(t, proto.actions.DELETE, (record, existingObject) => {
      const resolved = recordUtil.resolve(record, existingObject)
      t.equals(resolved, record, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('DELETE, no existing object -> null', (t) => {
    forRecordsWithAction(t, proto.actions.DELETE, (record) => {
      const resolved = recordUtil.resolve(record, undefined)
      t.equals(resolved, null, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('UPDATE, existing object -> identity', (t) => {
    forRecordsWithAction(t, proto.actions.UPDATE, (record, existingObject) => {
      const resolved = recordUtil.resolve(record, existingObject)
      t.equals(resolved, record, `${t.name}: ${record.objectData}`)
    })
  })

  t.test('UPDATE, no existing object', (t) => {
    t.plan(6)
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
          creationTime: time
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
            creationTime: time
          },
          isFolder: false
        },
        objectData: 'bookmark'
      }
      resolveToCreate(t, recordProps, resolvedProps, t.name)
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
