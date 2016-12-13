'use strict'

const awsSdk = require('aws-sdk')

/**
 * Parses an AWS credentials endpoint response.
 * @param {Object} serializer proto serializer object
 * @param {Uint8Array} bytes response body
 * @param {string|undefined} region optional AWS region
 * @return {{s3: Object, postData: Object, expiration: string, bucket: string}}
 */
module.exports.parseAWSResponse = (serializer, bytes, region) => {
  if (!serializer) {
    throw new Error('Missing proto serializer object.')
  }
  const parsedBody = serializer.byteArrayToCredentials(bytes)
  const credentials = parsedBody.aws
  if (!credentials) {
    throw new Error('AWS did not return credentials!')
  }
  if (!parsedBody.s3Post) {
    throw new Error('AWS did not return s3Post data!')
  }
  const postData = parsedBody.s3Post.postData
  const expiration = credentials.expiration
  const bucket = parsedBody.s3Post.bucket
  if (region) {
    awsSdk.region = region
  }
  const s3 = new awsSdk.S3({
    credentials: new awsSdk.Credentials({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    })
  })
  return {s3, postData, expiration, bucket}
}
