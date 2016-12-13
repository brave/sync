'use strict'

// We use this to limit upload body size to limit abuse of S3.
// https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-UsingHTTPPOST.html

const config = require('config')
const crypto = require('crypto')
const util = require('../lib/util.js')

class UserAwsS3PostAuthenticator {
  constructor (userId, s3Bucket) {
    this.userId = userId
    if (!userId) { throw new Error('Missing userId') }
    this.s3Bucket = s3Bucket
    if (!this.s3Bucket) { throw new Error('Missing s3Bucket') }
    this.date = new Date()
  }

  perform () {
    const s3PostPolicy = Buffer.from(this.s3PostPolicy()).toString('base64')
    const policySignature = crypto.createHmac('sha1', config.awsSecretAccessKey)
      .update(s3PostPolicy)
      .digest('base64')
    return {
      AWSAccessKeyId: config.awsAccessKeyId,
      policy: s3PostPolicy,
      signature: policySignature,
      acl: 'private'
    }
  }

  expirationDate () {
    const expirationTimestamp = this.date.getTime() + config.userAwsCredentialTtl * 1000
    return new Date(expirationTimestamp)
  }

  s3PostPolicy () {
    return util.conciseTemplateString`
    {
      "expiration": "${this.expirationDate().toISOString()}",
      "conditions": [
        {"bucket": "${this.s3Bucket}"},
        ["starts-with", "$key", "${this.s3Prefix()}"],
        {"acl": "private"},
        ["content-length-range", 0, 0]
      ]
    }
    `
  }

  s3Prefix () {
    return `${config.apiVersion}/${this.userId}`
  }
}

module.exports = UserAwsS3PostAuthenticator
