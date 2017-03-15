'use strict'

// Dependencies
// ===

// web server
const Express = require('express')
const cors = require('cors')

// See config/
const Config = require('config')

// Local libs
// ===
const Util = require('./lib/util.js')

// App
// ===

const app = Express()

// Exception handling. The Sentry request handler must be the first item.
let raven = null
let ravenOnError = null
if (Config.sentryUrl) {
  raven = require('raven')
  ravenOnError = (_error, request, response, next) => {
    response.set({ 'content-type': 'application/json; charset=utf-8' })
    response.statusCode = 500
    response.end(`Server error! 🎁\nWe made an oops, sorry about that. Please try again later.\nError ID: ${response.sentry}\n`)
  }
  // The request handler must be the first item
  app.use(raven.middleware.express.requestHandler(Config.sentryUrl))
}

app.disable('x-powered-by')
if (Config.logLevel === 'debug') {
  app.use(Util.debugLogger)
}

app.post('/:userId/credentials', cors({
  origin: '*'
}))

const UsersRouter = require('./users.js')
app.use('/', UsersRouter)

// Exception handling. The Sentry error handler must be before any other error middleware.
if (Config.sentryUrl) {
  app.use(raven.middleware.express.errorHandler(Config.sentryUrl))
  app.use(ravenOnError)
}

app.listen(Config.port)

Util.logger.info(`NODE_ENV: ${Config.util.getEnv('NODE_ENV')}`)
Util.logger.info(`sync server up on localhost:${Config.port}`)
