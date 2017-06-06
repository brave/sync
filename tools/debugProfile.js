// Debugs the contents of a Sync Profile.

const niceware = require('niceware')
const RequestUtil = require('../client/requestUtil')
const proto = require('../client/constants/proto')
const Serializer = require('../lib/serializer')
const clientTestHelper = require('../test/client/testHelper')

// CHANGE this to the profile you'd like to test.
const seedPhrase = 'germanized fettle episcopate plume beholding initiatory estoppage edison afterdeck knickknack attainably gelatinized milkwort nybble dural seasick'
const seed = niceware.passphraseToBytes(seedPhrase.split(' '))

const CONFIG = {
  apiVersion: '0',
  serverUrl: 'https://sync-staging.brave.com',
  fetchInterval: 1000
}
const ACTION_ENUM = {
  0: 'Create',
  1: 'Update',
  2: 'Delete'
}

Serializer.init().then((serializer) => {
  clientTestHelper.getSerializedCredentials(serializer, CONFIG, seed).then((data) => {
    const args = {
      apiVersion: CONFIG.apiVersion,
      credentialsBytes: data.serializedCredentials,
      keys: data.keys,
      serializer,
      serverUrl: CONFIG.serverUrl
    }
    const s3ObjectsToRecords = s3Objects => requestUtil.s3ObjectsToRecords(s3Objects.contents)
    const logRecords = (response) => {
      console.log(`Record count: ${response.length}`)
      for (let record of response) {
        let s = `${record.syncTimestamp} action: ${ACTION_ENUM[record.action]}, deviceId: [${record.deviceId.toString()}], objectId: [${record.objectId.toString()}]`
        delete record.syncTimestamp
        delete record.action
        delete record.deviceId
        delete record.objectId
        s += `\n  ${JSON.stringify(record)}`
        console.log(s)
      }
    }
    const requestUtil = new RequestUtil(args)
    requestUtil.list(proto.categories.BOOKMARKS)
      .then(s3ObjectsToRecords)
      .then(logRecords)
    requestUtil.list(proto.categories.HISTORY_SITES)
      .then(s3ObjectsToRecords)
      .then(logRecords)
    requestUtil.list(proto.categories.PREFERENCES)
      .then(s3ObjectsToRecords)
      .then(logRecords)
  })
})
