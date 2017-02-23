/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const ipc = window.chrome.ipcRenderer
const writeActions = require('../constants/proto').actions

// Whitelist of valid browser-laptop site fields. In browser-laptop, site
// is used for both bookmarks and history sites.
const SITE_FIELDS = ['objectId', 'location', 'title', 'customTitle', 'tags', 'favicon', 'themeColor', 'lastAccessedTime', 'creationTime', 'partitionNumber', 'folderId', 'parentFolderId']

const pickFields = (object, fields) => {
  return fields.reduce((a, x) => {
    if (object.hasOwnProperty(x)) { a[x] = object[x] }
    return a
  }, {})
}

/**
 * Apply a bookmark or historySite SyncRecord to the browser data store.
 * @param {Object} record
 * @param {Object} existingObjectData
 * @param {Immutable.Map} siteDetail
 */
const applySiteRecord = (record, existingObjectData) => {
  const objectId = record.objectId
  let tag

  let siteProps = Object.assign(
    {},
    existingObjectData,
    record.historySite,
    record.bookmark,
    record.bookmark && record.bookmark.site,
    {objectId}
  )
  if (record.objectData === 'bookmark') {
    const existingFolderId = existingObjectData && existingObjectData.folderId
    if (existingFolderId) {
      siteProps.folderId = existingFolderId
    }
    const isFolder = (typeof siteProps.isFolder === 'boolean')
      ? siteProps.isFolder
      : !!existingFolderId
    tag = isFolder
      ? 'bookmark-folder'
      : 'bookmark'
  }

  const siteDetail = pickFields(siteProps, SITE_FIELDS)

  switch (record.action) {
    case writeActions.CREATE:
      syncActions.addSite(siteDetail, tag, undefined, undefined, true)
      break
    case writeActions.UPDATE:
      syncActions.addSite(siteDetail, tag, existingObjectData, null, true)
      break
    case writeActions.DELETE:
      syncActions.removeSite(siteDetail, tag, true)
      break
  }
}

const applySiteSettingRecord = (record, existingObjectData) => {
  // TODO: In Sync lib syncRecordAsJS() convert Enums into strings
  const adControlEnum = {
    0: 'showBraveAds',
    1: 'blockAds',
    2: 'allowAdsAndTracking'
  }
  const cookieControlEnum = {
    0: 'block3rdPartyCookie',
    1: 'allowAllCookies'
  }
  const getValue = (key, value) => {
    if (key === 'adControl') {
      return adControlEnum[value]
    } else if (key === 'cookieControl') {
      return cookieControlEnum[value]
    } else {
      return value
    }
  }
  const hostPattern = record.siteSetting.hostPattern
  if (!hostPattern) {
    throw new Error('siteSetting.hostPattern is required.')
  }

  let applySetting = null
  switch (record.action) {
    case writeActions.CREATE:
    case writeActions.UPDATE:
      if (existingObjectData) {
        applySetting = (key, value) => {
          const applyValue = getValue(key, value)
          if (existingObjectData.get(key) === applyValue) { return }
          syncActions.changeSiteSetting(hostPattern, key, applyValue, false, true)
        }
      } else {
        // set the object ID
        syncActions.changeSiteSetting(hostPattern, 'objectId', record.objectId, false, true)
        applySetting = (key, value) => {
          const applyValue = getValue(key, value)
          syncActions.changeSiteSetting(hostPattern, key, applyValue, false, true)
        }
      }
      break
    case writeActions.DELETE:
      applySetting = (key, _value) => {
        syncActions.removeSiteSetting(hostPattern, key, false, true)
      }
      break
  }

  for (let key in record.siteSetting) {
    if (key === 'hostPattern') { continue }
    applySetting(key, record.siteSetting[key])
  }
}

/**
 * Given a SyncRecord, apply it to the browser data store.
 * @param {Object} record
 * @param {Object} existingObjectData
 */
const applySyncRecord = (record, existingObjectData) => {
  if (!record || !record.objectData) {
    console.log(`Warning: Can't apply empty record: ${record}`)
    return
  }
  switch (record.objectData) {
    case 'bookmark':
    case 'historySite':
      applySiteRecord(record, existingObjectData)
      break
    case 'siteSetting':
      applySiteSettingRecord(record, existingObjectData)
      break
    case 'device':
      // TODO
      break
    default:
      throw new Error(`Invalid record objectData: ${record.objectData}`)
  }
}

const syncActions = {
  /**
   * Dispatches a window action
   * @param {Object} action
   */
  dispatchAction: function (action) {
    ipc.send('dispatch-action', JSON.stringify(action))
  },

  /**
   * Dispatches an event to the renderer process to change a setting
   * @param {Array} records
   * @param {Array} existingObjects
   */
  resolveSyncRecords: function (records, existingObjects) {
    if (records.length === 0) { return }
    setTimeout(() => {
      const record = records.shift()
      const object = existingObjects.shift()
      applySyncRecord(record, object)
      syncActions.resolveSyncRecords(records, existingObjects)
    }, 0)
  },

  addSite: function (siteDetail, tag, originalSiteDetail, destinationDetail, skipSync) {
    syncActions.dispatchAction({
      actionType: 'app-add-site',
      siteDetail,
      tag,
      originalSiteDetail,
      destinationDetail,
      skipSync
    })
  },

  removeSite: function (siteDetail, tag, skipSync) {
    syncActions.dispatchAction({
      actionType: 'app-remove-site',
      siteDetail,
      tag,
      skipSync
    })
  },

  changeSiteSetting: function (hostPattern, key, value, temp, skipSync) {
    syncActions.dispatchAction({
      actionType: 'app-change-site-setting',
      hostPattern,
      key,
      value,
      temporary: temp || false,
      skipSync
    })
  },

  removeSiteSetting: function (hostPattern, key, temp, skipSync) {
    syncActions.dispatchAction({
      actionType: 'app-remove-site-setting',
      hostPattern,
      key,
      temporary: temp || false,
      skipSync
    })
  }
}

module.exports = syncActions
