'use strict'

const proto = require('./constants/proto')
const serializer = require('../lib/serializer')
const {api} = require('../lib/api.proto.js')
const syncTypes = require('../lib/syncTypes.js')

// ['0', '1', '2']
// webkit on iOS <= 10.2 does not support Object.values
module.exports.CATEGORY_IDS = Object.keys(proto.categories).map((key) => proto.categories[key])

const pickFields = (object, fields) => {
  return fields.reduce((a, x) => {
    if (object.hasOwnProperty(x)) { a[x] = object[x] }
    return a
  }, {})
}

/**
 * Converts [] parentFolderObjectIds fields to null in place. Fix #107.
 * @param {Object} record
 */
const normalizeBookmark = (record) => {
  if (record && record.bookmark && record.bookmark.parentFolderObjectId &&
    !record.bookmark.parentFolderObjectId.length) {
    record.bookmark.parentFolderObjectId = null
  }
}

/**
 * Keeps only most the right pairs in array for each unique objectId from recordsAndExistingObjects
 * Pairs in recordsAndExistingObjects are expected to be sorted by timestamp
 */
module.exports.keepMostRecent = (recordsAndExistingObjects) => {
  var alreadySeenObjectId = new Set()
  for (var i = recordsAndExistingObjects.length - 1; i >= 0; --i) {
    if (recordsAndExistingObjects[i][0]) {
      const stringObjectId = JSON.stringify(recordsAndExistingObjects[i][0].objectId)
      if (alreadySeenObjectId.has(stringObjectId)) {
        recordsAndExistingObjects.splice(i, 1)
      } else {
        alreadySeenObjectId.add(stringObjectId)
      }
    }
  }
  return recordsAndExistingObjects
}

/**
 * Gets the record from if its timestamp greater, or action is DELETE
 * If any of the records does not have the timestamp, choose server record
 */
module.exports.getThisPairWinner = (recordAndLocalObject) => {
  const serverRecord = recordAndLocalObject[0]
  const localRecord = recordAndLocalObject[1]

  if (serverRecord.action === proto.actions.DELETE ||
    !localRecord) {
    return serverRecord
  } else if (localRecord.action === proto.actions.DELETE) {
    return localRecord
  } else if ((!serverRecord.syncTimestamp || !localRecord.syncTimestamp) ||
    (serverRecord.syncTimestamp >= localRecord.syncTimestamp)) {
    return serverRecord
  } else {
    return localRecord
  }
}

/**
 * Gets the record from if its timestamp greater, or action is DELETE
 * If both records does not have timestamp, choose server record
 */
const getPerPairWinners = (recordsAndExistingObjects) => {
  let resolvedRecords = []
  for (var i = 0; i < recordsAndExistingObjects.length; ++i) {
    resolvedRecords.push(this.getThisPairWinner(recordsAndExistingObjects[i]))
  }
  return resolvedRecords
}

/**
 * Given a list of new SyncRecords and matching browser objects, finds the latest
 * changes to perform modification of the browser's data.
 * @param {Array} recordsAndExistingObjects
 * @returns {Array.<Object>} Resolved syncRecords to apply to browser data.
*/
module.exports.resolveRecords = (recordsAndExistingObjects) => {
  let resolvedRecords = []
  recordsAndExistingObjects.forEach((item) => {
    if (item) {
      normalizeBookmark(item[0])
      normalizeBookmark(item[1])
    }
  })

  recordsAndExistingObjects = this.keepMostRecent(recordsAndExistingObjects)
  resolvedRecords = getPerPairWinners(recordsAndExistingObjects)
  return resolvedRecords
}

/**
 * Given a SyncRecord protobuf object, convert to a basic JS object.
 * @param {Serializer.api.SyncRecord}
 * @returns {Object}
 */
module.exports.syncRecordAsJS = (record) => {
  /* We should be able to call toObject({defaults: true}) but it doesn't work.
   * I think it's because objectData is a oneof.
   * .toObject() options:
   * http://dcode.io/protobuf.js/global.html#ConversionOptions
   */
  const object = api.SyncRecord.toObject(record)
  object.action = record.action
  const type = serializer.getSyncRecordObjectData(record)
  if (!syncTypes[type]) {
    throw new Error('Unknown sync objectData type: ' + type)
  }
  object.objectData = type
  const data = api.SyncRecord[syncTypes[type]].toObject(record[type], {
    defaults: true,
    enums: Number,
    longs: Number
  })
  if (data.fields && data.fields.length > 0) {
    object[type] = pickFields(data, data.fields)
    // Empty the fields field for backwards compatibility with protobufjs 6.6
    if (object[type].fields) {
      object[type].fields = []
    }
  } else {
    object[type] = data
  }
  return object
}

/**
 * Derive category ID number from a JS Sync record.
 * @param {Object} record e.g. {"action":0, "bookmark": {"isFolder": false,"site": {...}, ...}
 * @returns {string} e.g. '0' for bookmark
 */
module.exports.getRecordCategory = (record) => {
  for (let type in proto.categoryMap) {
    if (record[type]) {
      const categoryName = proto.categoryMap[type]
      if (!categoryName) { return undefined }
      return proto.categories[categoryName]
    }
  }
}
