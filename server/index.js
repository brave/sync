'use strict'

// Dependencies
// ===

const BodyParser = require('body-parser')

// web server
const Express = require('express')

// const Querystring = require("querystring")

// See config/
const Config = require('config')

// Local libs
// ===
const Util = require('./lib/util.js')

// App
// ===

const express = Express()
express.disable('x-powered-by')
express.use(BodyParser.text({type: '*/*'}))
if (Config.logLevel === 'debug') {
  express.use(Util.debugLogger)
}

const UsersRouter = require('./users.js')
express.use('/', UsersRouter)

express.listen(Config.port)

Util.logger.info(`NODE_ENV: ${Config.util.getEnv('NODE_ENV')}`)
Util.logger.info(`sync server up on localhost:${Config.port}`)
