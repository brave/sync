const test = require('tape')
const crypto = require('../lib/crypto')
const s3Helper = require('../lib/s3Helper')

test('s3Helper byteArray/s3String conversion', (t) => {
  t.plan(10)
  for (let i = 0; i < 10; i++) {
    const bytes = crypto.randomBytes(10)
    const s3String = s3Helper.byteArrayToS3String(bytes)
    t.deepEqual(bytes, s3Helper.s3StringToByteArray(s3String))
  }
})
