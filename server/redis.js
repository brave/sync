const Config = require('config')
const redis = require('redis')
const Util = require('./lib/util.js')

const client = redis.createClient(Config.redisUrl)

client.on('connect', function () {
  Util.logger.info('redis client connected')
})

client.on('error', function (err) {
  Util.logger.error(err)
})

module.exports = client
