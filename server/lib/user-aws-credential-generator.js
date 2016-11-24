'use strict'

const Config = require('config')
const Crypto = require('crypto')
const AwsSdk = require('aws-sdk')
const Util = require('../lib/util.js')

class UserAwsCredentialGenerator {
  constructor (userId) {
    this.userId = userId
    if (!userId) { throw new Error('Missing userId') }
    this.s3Bucket = Config.awsS3Bucket
    if (!this.s3Bucket) { throw new Error('S3 bucket not configured; please set AWS_S3_BUCKET.') }
  }

  perform () {
    const params = {
      DurationSeconds: Config.userAwsCredentialTtl,
      Name: this.awsStsName(),
      Policy: this.awsStsPolicy()
    }
    return this.awsSts().getFederationToken(params).promise()
  }

  awsSts () {
    return new AwsSdk.STS()
  }

  awsStsName () {
    var token = Crypto.randomBytes(4).toString('hex')
    return `sync-client-${Config.util.getEnv('NODE_ENV')}-${token}`
  }

  awsStsPolicy () {
    return Util.conciseTemplateString`
    {
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "arn:aws:s3:::${this.s3Bucket}",
          "Condition": {
            "StringLike": {"s3:prefix": "${this.userId}/*"}
          }
        },
        {
          "Effect": "Allow",
          "Action": "s3:DeleteObject",
          "Resource": "arn:aws:s3:::${this.s3Bucket}/${this.userId}"
        },
        {
          "Effect": "Allow",
          "Action": "s3:DeleteObject",
          "Resource": "arn:aws:s3:::${this.s3Bucket}/${this.userId}/*"
        },
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject"],
          "Resource": "arn:aws:s3:::${this.s3Bucket}/${this.userId}/devices"
        },
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject"],
          "Resource": "arn:aws:s3:::${this.s3Bucket}/${this.userId}/bookmarks/*"
        },
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject"],
          "Resource": "arn:aws:s3:::${this.s3Bucket}/${this.userId}/historySites/*"
        },
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject"],
          "Resource": "arn:aws:s3:::${this.s3Bucket}/${this.userId}/siteSettings/*"
        }
      ]
    }
    `
  }
}

module.exports = UserAwsCredentialGenerator
