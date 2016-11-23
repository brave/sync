'use strict'

// Dependencies
// ===

const BodyParser = require('body-parser')

// web server
const Express = require('express')

// const Querystring = require("querystring")

// HTTP requests
// const Request = require("request")

// See config/
var Config = require('config')

// Local libs
// ===
var Util = require('./util.js')

// App
// ===

var express = Express()
express.disable('x-powered-by')
express.use(BodyParser.text({type: '*/*'}))
if (Config.logLevel === 'debug') {
  express.use(Util.debugLogger)
}

var UsersRouter = require('./users.js')
express.use('/', UsersRouter)

express.get('/', (request, response) => {
  response.send('☁️🎬✌️')
})

express.listen(Config.port)

Util.logger.info(`NODE_ENV: ${Config.util.getEnv('NODE_ENV')}`)
Util.logger.info(`sync server up on localhost:${Config.port}`)
