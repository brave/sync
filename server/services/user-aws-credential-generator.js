'use strict'

const Config = require('config')
const Crypto = require('crypto')
const AwsSdk = require('aws-sdk')
const Util = require('../util.js')

class UserAwsCredentialGenerator {
  constructor (userId) {
    this.userId = userId
  }

  perform () {
    const params = {
      DurationSeconds: 129600, // 36 hours (max)
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
          "Action": ["s3:GetObject", "s3:PutObject"],
          "Resource": "arn:aws:s3:::brave-sync-staging/${this.userId}/bookmarks/*"
        },
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "arn:aws:s3:::brave-sync-staging",
          "Condition": {
            "StringLike": {"s3:prefix": "${this.userId}/bookmarks/"}
          }
        },
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject", "s3:PutObject"],
          "Resource": "arn:aws:s3:::brave-sync-staging/${this.userId}/historySites/*"
        },
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "arn:aws:s3:::brave-sync-staging",
          "Condition": {
            "StringLike": {"s3:prefix": "${this.userId}/historySites/"}
          }
        },
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject", "s3:PutObject"],
          "Resource": "arn:aws:s3:::brave-sync-staging/${this.userId}/siteSettings/*"
        },
        {
          "Effect": "Allow",
          "Action": "s3:ListBucket",
          "Resource": "arn:aws:s3:::brave-sync-staging",
          "Condition": {
            "StringLike": {"s3:prefix": "${this.userId}/siteSettings/"}
          }
        }
      ]
    }
    `
  }
}

module.exports = UserAwsCredentialGenerator
