'use strict'

const awsSdk = require('aws-sdk')
const s3Helper = require('../lib/s3Helper')

/**
 * @param {Object} serializer
 * @param {Uint8Array} credentialsBytes
 * @param {string} apiVersion
 * @param {string} userId
 */
const RequestUtil = function (serializer, credentialsBytes, apiVersion, userId) {
  if (!apiVersion) { throw new Error('Missing apiVersion.') }
  this.apiVersion = apiVersion
  if (!userId) { throw new Error('Missing userId.') }
  this.userId = userId

  this.serializer = serializer
  const response = this.parseAWSResponse(credentialsBytes)
  this.s3 = response.s3
  this.postData = response.postData
  this.expiration = response.expiration
  this.bucket = response.bucket
  this.region = response.region
  this.s3PostEndpoint = `https://${this.bucket}.s3.dualstack.${this.region}.amazonaws.com`
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
    convertResponseTypes: false,
    credentials: new awsSdk.Credentials({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    }),
    // The bucket name is prepended to the endpoint to build the actual request URL, e.g.
    // https://brave-sync-staging.s3.dualstack.us-west-2.amazonaws.com
    endpoint: `https://s3.dualstack.${region}.amazonaws.com`,
    region: region,
    sslEnabled: true,
    useDualstack: true
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
  return s3Helper.listObjects(this.s3, options)
    .then((data) => {
      return data.map((s3Object) => {
        const parsedKey = s3Helper.parseS3Key(s3Object.Key)
        // TODO: Recombine split records
        const decodedData = s3Helper.s3StringToByteArray(parsedKey.recordPartString)
        return decodedData
      })
    })
}

/**
 * Record S3 prefix with current timestamp.
 * {apiVersion}/{userId}/{category}/{timestamp}/
 * @returns {string}
 */
RequestUtil.prototype.currentRecordPrefix = function (category) {
  return `${this.apiVersion}/${this.userId}/${category}/${getTime()}/`
}

/**
 * Puts a single record, splitting it into multiple objects if needed.
 * @param {string} category - the category ID
 * @param {Uint8Array} record - the object content, serialized and encrypted
 */
RequestUtil.prototype.put = function (category, record) {
  const s3Prefix = this.currentRecordPrefix(category)
  const s3Keys = s3Helper.encodeDataToS3KeyArray(s3Prefix, record)
  const fetchPromises = s3Keys.map((key, _i) => {
    const params = {
      method: 'POST',
      body: this.s3PostFormData(key)
    }
    return window.fetch(this.s3PostEndpoint, params)
      .then(checkFetchStatus)
  })
  return Promise.all(fetchPromises)
}

RequestUtil.prototype.s3PostFormData = function (objectKey) {
  let formData = new FormData() // eslint-disable-line
  formData.append('key', objectKey)
  for (let key of Object.keys(this.postData)) {
    formData.append(key, this.postData[key])
  }
  formData.append('file', new Uint8Array([]))
  return formData
}

/**
 * In S3 you can't delete all keys matching a prefix, so you need to list by
 * prefix then delete them all.
 * @param {string} prefix
 */
RequestUtil.prototype.s3DeletePrefix = function (prefix) {
  return s3Helper.deletePrefix(this.s3, this.bucket, prefix)
}

RequestUtil.prototype.deleteUser = function () {
  return this.s3DeletePrefix(`${this.apiVersion}/${this.userId}`)
}

/**
 * @param {string} category - the category ID
 */
RequestUtil.prototype.deleteCategory = function (category) {
  return this.s3DeletePrefix(`${this.apiVersion}/${this.userId}/${category}`)
}

function checkFetchStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function getTime () {
  return Math.floor(Date.now() / 1000)
}

module.exports = RequestUtil
