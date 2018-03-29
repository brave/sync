'use strict'

const config = require('config')
const awsSdk = require('aws-sdk')


class UserAwsS3BucketConfiguration {
  constructor (userId, s3Bucket, topicARN, prefix) {
    this.userId = userId
    if (!userId) { throw new Error('Missing userId') }
    this.s3Bucket = s3Bucket
    if (!this.s3Bucket) { throw new Error('Missing s3Bucket') }
    this.topicARN = topicARN
    if (!this.topicARN) { throw new Error('Missing topicARN') }
    this.prefix = prefix
    if (!this.prefix) { throw new Error('Missing prefix') }
    // to do debug
    awsSdk.config.update({
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
        region: config.awsRegion
    });
    //
    this.s3 = new awsSdk.S3({
      credentials: new awsSdk.Credentials({
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey
    }),
    convertResponseTypes: false,
    // The bucket name is prepended to the endpoint to build the actual request URL, e.g.
    // https://brave-sync-staging.s3.dualstack.us-west-2.amazonaws.com
    endpoint: `https://s3.dualstack.${config.awsRegion}.amazonaws.com`,
    maxRetries: 10,
    region: config.awsRegion,
    sslEnabled: true,
    useDualstack: true})
  }

  perform () {
    let getBucketNotificationConfiguration = {
      Bucket: `${this.s3Bucket}`
    }
    this.s3.getBucketNotificationConfiguration(getBucketNotificationConfiguration, (errorGetNotif, dataGetNotif) => {
      if (errorGetNotif) {
        console.log('S3 getBucketNotificationConfiguration failed with error: ' + errorGetNotif)
      } else if (dataGetNotif) {
        var currentObject = {
          TopicConfigurations: []
        }
        if (dataGetNotif) {
          currentObject = dataGetNotif
        }
        currentObject.TopicConfigurations.push({
          Events: [
            's3:ObjectCreated:Post'
          ],
          TopicArn: `${this.topicARN}`,
          Filter: {
            Key: {
              FilterRules: [
                {
                  Name: 'prefix',
                  Value: `${this.prefix}`
                }
              ]
            }
          }
        })
        let bucketNotificationConfiguration = {
          Bucket: `${this.s3Bucket}`,
          NotificationConfiguration: currentObject
        }
        this.s3.putBucketNotificationConfiguration(bucketNotificationConfiguration, (errorNotif, dataNotif) => {
          if (errorNotif) {
            console.log('S3 putBucketNotificationConfiguration failed with error: ' + errorNotif)
          }
        })
      }
    })
  }
}

module.exports = UserAwsS3BucketConfiguration
