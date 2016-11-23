const Winston = require("winston")
const Config = require("config")

exports.logger = new (Winston.Logger)({
  level: Config.logLevel,
  transports: [
    new (Winston.transports.Console)()
  ]
})

// Log additional things in development environments.
exports.debugLogger = (request, response, next) => {
  logger.debug("-> Headers:", request.headers)
  if (request.cookies) {
    for (let cookieName in request.cookies) {
      logger.debug(`-> Cookie: ${cookieName}:`, request.cookies[cookieName])
    }
  }

  if (request.query && request.query.data) {
    logger.debug("-> Query:", request.query)
    logger.debug("-> Query data:", parseQuery(request.query.data))
  } else {
    logger.debug("-> Query: (empty)")
  }

  if (request.body && request.body.length) {
    logger.debug("-> Body:", request.body)
    const rawData = Querystring.parse(request.body).data
    logger.debug("-> Body data:", parseQuery(rawData))
  } else {
    logger.debug("-> Body: (empty)")
  }

  next()
}

exports.userAgent = `sync-server/${process.env.npm_package_version} (brave.com)`

// https://muffinresearch.co.uk/removing-leading-whitespace-in-es6-template-strings/
exports.conciseTemplateString = (strings, ...values) => {
  // Interweave the strings with the
  // substitution vars first.
  let output = '';
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/);

  // Rip out the leading whitespace.
  return lines.map((line) => {
    return line.replace(/^\s+/gm, '');
  }).join(' ').trim();
}
