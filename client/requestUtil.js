'use strict'

const awsSdk = require('aws-sdk')

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

RequestUtil.prototype.list = function (category) {
  const options = {
    MaxKeys: 1000,
    Bucket: this.bucket,
    Prefix: `${this.apiVersion}/${this.userId}/${category}`
  }
  var contents = []
  return new Promise((resolve, reject) => {
    const getContents = (token) => {
      options.ContinuationToken = token
      this.s3.listObjectsV2(options, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        contents = contents.concat(data.Contents)
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

module.exports = RequestUtil
