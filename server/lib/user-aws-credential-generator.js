'use strict'

const config = require('config')
const crypto = require('crypto')
const awsSdk = require('aws-sdk')
const util = require('../lib/util.js')

class UserAwsCredentialGenerator {
  constructor (userId) {
    this.userId = userId
    if (!userId) { throw new Error('Missing userId') }
    this.s3Bucket = config.awsS3Bucket
    if (!this.s3Bucket) { throw new Error('S3 bucket not configured; please set AWS_S3_BUCKET.') }
  }

  perform () {
    const params = {
      DurationSeconds: config.userAwsCredentialTtl,
      Name: this.awsStsName(),
      Policy: this.awsStsPolicy()
    }
    return this.awsSts().getFederationToken(params).promise()
  }

  awsSts () {
    return new awsSdk.STS()
  }

  awsStsName () {
    var token = crypto.randomBytes(4).toString('hex')
    return `sync-client-${config.util.getEnv('NODE_ENV')}-${token}`
  }

  awsStsPolicy () {
    return util.conciseTemplateString`
    {
      "Version":"2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "arn:aws:s3:::${this.s3Bucket}",
          "Condition": {
            "StringLike": {"s3:prefix": "${this.s3Prefix()}/*"}
          }
        },
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "${this.arnS3Prefix()}"
        },
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "${this.arnS3Prefix()}/*"
        },
        {
          "Effect": "Allow",
          "Action": "s3:DeleteObject",
          "Resource": "${this.arnS3Prefix()}"
        },
        {
          "Effect": "Allow",
          "Action": "s3:DeleteObject",
          "Resource": "${this.arnS3Prefix()}/*"
        }
      ]
    }
    `
  }

  arnS3Prefix () {
    return `arn:aws:s3:::${this.s3Bucket}/${this.s3Prefix()}`
  }

  s3Prefix () {
    return `${config.apiVersion}/${this.userId}`
  }
}

module.exports = UserAwsCredentialGenerator
