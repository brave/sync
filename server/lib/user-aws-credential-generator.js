'use strict'

const config = require('config')
const crypto = require('crypto')
const awsSdk = require('aws-sdk')
const util = require('../lib/util.js')

class UserAwsCredentialGenerator {
  constructor (userId, s3Bucket) {
    this.userId = userId
    if (!userId) { throw new Error('Missing userId') }
    this.s3Bucket = s3Bucket
    if (!this.s3Bucket) { throw new Error('Missing s3Bucket.') }
  }

  perform () {
    // AwsSts #getFederationToken() returns:
    /* {
         ResponseMetadata: { RequestId: '...' },
         Credentials: {
           AccessKeyId: '...', SecretAccessKey: '...', SessionToken: '...', Expiration: 2016-12-04T01:23:45.000Z // <Date>
         },
         FederatedUser: { FederatedUserId: '012345678900:{specified below}',
         Arn: 'arn:aws:sts::012345678900:federated-user/{specified below}' },
         PackedPolicySize: 42
        }
    */
    const params = {
      DurationSeconds: config.userAwsCredentialTtl,
      Name: this.awsStsName(),
      Policy: this.awsStsPolicy()
    }

    return new Promise((resolve, reject) => {
      this.awsSts().getFederationToken(params).promise()
      .catch((data) => { reject(data) })
      .then((data) => {
        const returnData = {
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken,
          expiration: data.Credentials.Expiration.toJSON()
        }
        resolve(returnData)
      })
    })
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
            "StringLike": {"s3:prefix": "${this.s3Prefix()}"}
          }
        },
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
