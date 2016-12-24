'use strict'

// it helps you with s3

const S3_KEY_SIZE_MAX = 1024
// 1-digit in radix64 limits records to 64 parts * 800 bytes/part ~= 50 KiB
const S3_PART_INDEX_DIGITS = 1
const S3_PART_LIMIT = 64

/**
* Encodes a byte array as an S3 key-safe string
* @param {Uint8Array} bytes
* @returns {string}
*/
module.exports.byteArrayToS3String = function (bytes/* : Uint8Array */) {
  return Buffer.from(bytes).toString('base64')
}

/**
 * Decodes a S3 key-safe string to a byte array
 * @param {string} msg
 * @returns {Uint8Array}
 */
module.exports.s3StringToByteArray = function (msg/* : string */) {
  return new Uint8Array(Buffer.from(msg, 'base64'))
}

/**
 * Takes a common prefix and a large record and splits the record into pieces
 * in several S3 object keys.
 * @param {string} s3Prefix like '0/asdf/0/12345678/'
 * @param {Uint8Array} data
 * @returns {Array.<string>} ['prefix/
 */
module.exports.encodeDataToS3KeyArray = function (s3Prefix, data) {
  const crc = require('crc')
  const radix64 = require('./radix64')

  if (!s3Prefix) { throw new Error('s3 Prefix is required') }
  if (s3Prefix.substring(s3Prefix.length - 1) !== '/') {
    s3Prefix = s3Prefix.concat('/')
  }
  const dataCrc = radix64.fromNumber(crc.crc32.unsigned(data.buffer))

  // {prefix/}{dataCrc}/{partIndex}/ + {partData}
  const maxPartSize = S3_KEY_SIZE_MAX - s3Prefix.length - dataCrc.length - 1 - S3_PART_INDEX_DIGITS - 1
  const dataS3Encoded = this.byteArrayToS3String(data)
  const partCount = Math.ceil(dataS3Encoded.length / maxPartSize)
  if (partCount > S3_PART_LIMIT) {
    throw new Error(`Data is too big; part limit is ${S3_PART_LIMIT}.`)
  }

  let s3Keys = []
  for (let i = 0; i < partCount; i++) {
    const cursor = i * maxPartSize
    const dataPart = dataS3Encoded.slice(cursor, cursor + maxPartSize)
    const key = s3Prefix.concat(radix64.fromNumber(i), '/', dataCrc, '/', dataPart)
    s3Keys.push(key)
  }
  return s3Keys
}

/**
 * Parse S3 key into an object
 * @param {string} key
 * @returns {{apiVersion: <string>, userId: <string>, categoryId: <string>, timestamp: <string>, recordCrc: <number>, recordPartIndex: <number>, recordPartString: <string>}}
 */
module.exports.parseS3Key = function (key) {
  const radix64 = require('./radix64')

  const apiVersion = key.substring(0, 1)
  const userId = key.substring(2, 47)
  const otherParts = key.substring(47).split('/')
  const categoryId = otherParts[0]
  const timestamp = parseInt(otherParts[1])
  const recordCrc = radix64.toNumber(otherParts[2])
  const recordPartIndex = otherParts[3]
  const recordPartString = otherParts.slice(4).join('/')
  return {apiVersion, userId, categoryId, timestamp, recordCrc, recordPartIndex, recordPartString}
}

/**
 * listObjectsV2 plus follow all cursors.
 * @param {AwsSdk.S3} s3
 * @param {Object} options
 * @returns {Promise}
 */
module.exports.listObjects = function (s3, options) {
  return new Promise((resolve, reject) => {
    listObjectsV2Recursively(s3, options, (error, data) => {
      if (error) { reject(error) }
      resolve(data)
    })
  })
}

function listObjectsV2Recursively (s3, options, callback, contentsThusFar) {
  if (!contentsThusFar) { contentsThusFar = [] }
  s3.listObjectsV2(options, (error, data) => {
    if (error) {
      callback(error, null)
      return
    }
    const contents = data.Contents
    contentsThusFar = contentsThusFar.concat(contents)
    if (data.IsTruncated) {
      options.ContinuationToken = data.NextContinuationToken
      listObjectsV2Recursively(s3, options, callback, contentsThusFar)
    } else {
      callback(null, contentsThusFar)
    }
  })
}

/**
 * In S3 you can't delete all keys matching a prefix, so you need to list by
 * prefix then delete them all.
 * @param {AwsSdk.S3} s3
 * @param {string} bucket
 * @param {string} prefix
 * @returns {Promise(Array)}
 */
module.exports.deletePrefix = function (s3, bucket, prefix) {
  const options = {
    MaxKeys: 1000,
    Bucket: bucket,
    Prefix: prefix
  }
  return new Promise((resolve, reject) => {
    const listAndDelete = (token) => {
      options.ContinuationToken = token
      s3.listObjectsV2(options, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (!data.Contents) {
          reject('Missing object contents.')
          return
        }
        if (data.Contents.length === 0) {
          resolve([])
          return
        }
        let deleteObjects = []
        data.Contents.forEach((content) => {
          deleteObjects.push({Key: content.Key})
        })
        const deletePromise = s3.deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: deleteObjects
          }
        }).promise()
        let listAndDeletePromise = null
        if (data.IsTruncated && data.NextContinuationToken) {
          listAndDeletePromise = listAndDelete(data.NextContinuationToken)
        }
        Promise.all([deletePromise, listAndDeletePromise])
          .then((data) => { resolve(data) })
          .catch((error) => { reject(error) })
      })
    }
    listAndDelete()
  })
}
