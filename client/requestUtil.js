'use strict'

const awsSdk = require('aws-sdk')

/**
 * Parses an AWS credentials endpoint response.
 * @param {Object} serializer proto serializer object
 * @param {Uint8Array} bytes response body
 * @param {string|undefined} region optional AWS region
 * @return {{s3: Object, postData: Object, expiration: string, bucket: string, region: string}}
 */
module.exports.parseAWSResponse = (serializer, bytes) => {
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
