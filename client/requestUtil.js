'use strict'

const awsSdk = require('aws-sdk')
const crc32 = require('buffer-crc32')

// Max size of a record in bytes. Limited by s3 key size.
const MAX_RECORD_SIZE = 900

function getTime () {
  return Math.floor(Date.now() / 1000)
}

/**
 * @param {Object} serializer
 * @param {Uint8Array} bytes
 * @param {string} apiVersion
 * @param {string} userId
 */
const RequestUtil = function (serializer, bytes, apiVersion, userId) {
  this.serializer = serializer
  const response = this.parseAWSResponse(bytes)
  this.s3 = response.s3
  this.apiVersion = apiVersion
  this.userId = userId
  this.postData = response.postData
  this.expiration = response.expiration
  this.bucket = response.bucket
  this.region = response.region
}

/**
 * Parses an AWS credentials endpoint response.
 * @param {Uint8Array} bytes response body
 * @return {{s3: Object, postData: Object, expiration: string, bucket: string, region: string}}
 */
RequestUtil.prototype.parseAWSResponse = function (bytes) {
  const serializer = this.serializer
  if (!serializer) {
    throw new Error('Missing proto serializer object.')
  }
  const parsedBody = serializer.byteArrayToCredentials(bytes)
  const credentials = parsedBody.aws
  if (!credentials) {
    throw new Error('AWS did not return credentials!')
  }
  const postData = parsedBody.s3Post
  if (!postData) {
    throw new Error('AWS did not return s3Post data!')
  }
  const region = parsedBody.region
  if (!region) {
    throw new Error('AWS did not return region!')
  }
  const bucket = parsedBody.bucket
  if (!bucket) {
    throw new Error('AWS did not return bucket!')
  }
  const expiration = credentials.expiration
  const s3 = new awsSdk.S3({
    credentials: new awsSdk.Credentials({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    }),
    region: region
  })
  return {s3, postData, expiration, bucket, region}
}

/**
 * @param {string} category - the category ID
 * @returns {Promise(Array.<Uint8Array>)}
 */
RequestUtil.prototype.list = function (category) {
  const prefix = `${this.apiVersion}/${this.userId}/${category}`
  const options = {
    MaxKeys: 1000,
    Bucket: this.bucket,
    Prefix: prefix
  }
  var contents = []
  return new Promise((resolve, reject) => {
    const getContents = (token) => {
      options.ContinuationToken = token
      console.log(`LIST ${prefix}`)
      this.s3.listObjectsV2(options, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (!data.Contents) {
          reject('Missing object contents.')
          return
        }
        data.Contents.forEach((content) => {
          if (content && content.Key) {
            // the 6th part of the AWS key is the encrypted sync data,
            // which may itself contain the delimiter character
            let record = content.Key.split('/').slice(6).join('/')
            contents.push(this.serializer.stringToByteArray(record))
          }
        })
        if (data.IsTruncated && data.NextContinuationToken) {
          getContents(data.NextContinuationToken)
        } else {
          resolve(contents)
        }
      })
    }
    getContents()
  })
}

/**
 * Puts a single record, splitting it into multiple objects if needed.
 * @param {string} category - the category ID
 * @param {Uint8Array} record - the object content, serialized and encrypted
 */
RequestUtil.prototype.put = function (category, record) {
  const parts = []
  if (record.length > MAX_RECORD_SIZE) {
    let i = 0
    while (parts.length < Math.ceil(record.length / MAX_RECORD_SIZE)) {
      parts.push(record.slice(i, i + 900))
      i++
    }
  } else {
    parts.push(record)
  }
  // TODO: the prefix can be encoded to be shorter
  const crc = crc32.unsigned(record)
  parts.forEach((part, i) => {
    const now = getTime()
    const partString = this.serializer.byteArrayToString(part)
    const prefix = `${this.apiVersion}/${this.userId}/${category}/${now}/${crc}/${i}/${partString}`
    console.log(`PUT ${prefix}`)
    this.s3.putObject({
      Bucket: this.bucket,
      Prefix: prefix
    })
  })
}

RequestUtil.prototype.deleteUser = function () {
  return this.s3.deleteObject({
    Bucket: this.bucket,
    Prefix: `${this.apiVersion}/${this.userId}`
  }).promise()
}

/**
 * @param {string} category - the category ID
 */
RequestUtil.prototype.deleteCategory = function (category) {
  return this.s3.deleteObject({
    Bucket: this.bucket,
    Prefix: `${this.apiVersion}/${this.userId}/${category}`
  }).promise()
}

module.exports = RequestUtil
