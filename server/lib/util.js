const winston = require('winston')
const config = require('config')

exports.logger = new (winston.Logger)({
  level: config.logLevel,
  transports: [
    new (winston.transports.Console)()
  ]
})

// Log additional things in development environments.
exports.debugLogger = (request, response, next) => {
  this.logger.debug('->', request.url)
  this.logger.debug('-> Headers:', request.headers)
  if (request.cookies) {
    for (let cookieName in request.cookies) {
      this.logger.debug(`-> Cookie: ${cookieName}:`, request.cookies[cookieName])
    }
  }
  if (request.query && request.query.data) {
    this.logger.debug('-> Query:', request.query)
  }
  if (request.body && request.body.length) {
    this.logger.debug('-> Body:', request.body)
  }

  next()
}

// https://muffinresearch.co.uk/removing-leading-whitespace-in-es6-template-strings/
exports.conciseTemplateString = (strings, ...values) => {
  // Interweave the strings with the
  // substitution vars first.
  let output = ''
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i]
  }
  output += strings[values.length]

  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/)

  // Rip out the leading whitespace.
  return lines.map((line) => {
    return line.replace(/^\s+/gm, '')
  }).join(' ').trim()
}

const padDatePart = (number) => {
  if (number < 10) {
    return '0' + number
  }
  return number
}

// 20130728T000000Z
exports.dateToAmzDate = (date) => {
  return `${date.getUTCFullYear()}${padDatePart(date.getUTCMonth() + 1)}${padDatePart(date.getUTCDate())}T${padDatePart(date.getUTCHours())}${padDatePart(date.getUTCMinutes())}${padDatePart(date.getUTCSeconds())}Z`
}

exports.awsS3Endpoint = () => {
  return `https://${config.awsS3Bucket}.s3.dualstack.${config.awsRegion}.amazonaws.com`
}
