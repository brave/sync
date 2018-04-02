const test = require('tape')
const config = require('config')
const crypto = require('../../../lib/crypto')
const awsSdk = require('aws-sdk')

const UserAwsS3BucketConfiguration = require('../../../server/lib/user-aws-s3-bucket-configuration.js')

function SNSPolicy (snsArn) {
  return `
  {
    "Version":"2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "SNS:Publish",
        "Resource": "${snsArn}",
        "Condition": {
          "ArnEquals": {
            "aws:SourceArn": "arn:aws:s3:*:*:${config.awsS3Bucket}"
          }
        }
      }
    ]
  }
  `
}

test('userAwsS3BucketConfiguration', (t) => {
  t.plan(5)

  t.throws(
    () => { return new UserAwsS3BucketConfiguration() },
    'requires userId'
  )

  t.throws(
    () => { return new UserAwsS3BucketConfiguration('userId') },
    'requires s3Bucket'
  )

  t.throws(
    () => { return new UserAwsS3BucketConfiguration('userId', 's3Bucket') },
    'requires topicARN'
  )

  t.throws(
    () => { return new UserAwsS3BucketConfiguration('userId', 's3Bucket', 'topicARN') },
    'requires prefix'
  )

  this.apiVersion = config.apiVersion
  const keys = crypto.deriveKeys()
  this.userId = Buffer.from(keys.publicKey).toString('base64')
  this.bucket = config.awsS3Bucket
  this.userIdBase62 = this.userId.replace(/[^A-Za-z0-9]/g, '')
  this.userIdEncoded = encodeURIComponent(this.userId).replace('%2F', '/')

  t.test('perform()', (t) => {
    t.plan(1)

    this.sns = new awsSdk.SNS({
      credentials: new awsSdk.Credentials({
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey
      }),
      endpoint: `https://sns.${config.awsRegion}.amazonaws.com`,
      maxRetries: 1,
      region: config.awsRegion,
      sslEnabled: true
    })

    let params = {
      Name: `${this.bucket}-${this.apiVersion}-${this.userIdBase62}`
    }
    this.sns.createTopic(params, (error, data) => {
      if (error) {
        console.log('SNS creation failed with error: ' + error)
        t.fail('')
      } else if (data) {
        this.SNSArn = data.TopicArn
        let topicAttributesParams = {
          AttributeName: 'Policy',
          TopicArn: `${data.TopicArn}`,
          AttributeValue: `${SNSPolicy(data.TopicArn)}`
        }
        this.sns.setTopicAttributes(topicAttributesParams, (errorAttr, dataAttr) => {
          if (errorAttr) {
            console.log('SNS setTopicAttributes failed with error: ' + errorAttr)
          } else if (dataAttr) {
            // Set the bucket configuration on the server side as the s3 API can only
            // replace an existing configuration. We need to pull it first and append
            new UserAwsS3BucketConfiguration(this.userId, this.bucket, this.SNSArn, `${this.apiVersion}/${this.userIdEncoded}/`).perform()
              .then((data) => {
                if (data == null) {
                  t.fail('')
                } else {
                  t.pass('')
                }
              })
          }
        })
      }
    })
  })
})
