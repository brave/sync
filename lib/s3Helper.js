'use strict'

// it helps you with s3

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
 * Parse S3 key into an object
 * @param {string} key
 * @returns {{apiVersion: <string>, userId: <string>, categoryId: <string>, timestamp: <string>, data: <string>}}
 */
module.exports.parseS3Key = function (key) {
  const apiVersion = key.substring(0, 1)
  const userId = key.substring(2, 47)
  const otherParts = key.substring(47).split('/')
  const categoryId = otherParts[0]
  const timestamp = otherParts[1]
  const recordCrc = otherParts[2]
  const recordPartIndex = otherParts[3]
  const recordPartData = this.s3StringToByteArray(otherParts.slice(4).join('/'))
  return {apiVersion, userId, categoryId, timestamp, recordCrc, recordPartIndex, recordPartData}
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
