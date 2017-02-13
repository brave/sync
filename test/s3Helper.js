const test = require('tape')
const crc = require('crc')
const crypto = require('../lib/crypto')
const radix64 = require('../lib/radix64')
const s3Helper = require('../lib/s3Helper')

test('s3Helper', (t) => {
  t.plan(2)

  t.test('byteArray/s3String conversion', (t) => {
    t.plan(10)
    for (let i = 0; i < 10; i++) {
      const bytes = crypto.randomBytes(10)
      const s3String = s3Helper.byteArrayToS3String(bytes)
      t.deepEqual(bytes, s3Helper.s3StringToByteArray(s3String))
    }
  })

  t.test('encodeDataToS3KeyArray / parseS3Key', (t) => {
    t.plan(3)
    const s3Prefix = '0/xGrUe8vokl9kjAx+RTu9t6I1UnOT7mcdcizAVI+2bos=/2/1482435340000'

    t.test(`${t.name}: small data`, (t) => {
      t.plan(3)
      const data = crypto.randomBytes(10)
      const s3Keys = s3Helper.encodeDataToS3KeyArray(s3Prefix, data)
      t.equal(s3Keys.length, 1, `${t.name} encodes to one part`)
      const parsedKey = s3Helper.parseS3Key(s3Keys[0])
      const decodedData = s3Helper.s3StringToByteArray(parsedKey.recordPartString)
      t.deepEqual(decodedData, data, `${t.name} encode/decodes correctly`)
      const dataCrc = radix64.fromNumber(crc.crc32.unsigned(decodedData.buffer))
      t.equal(parsedKey.recordCrc, dataCrc, `${t.name} checksum ok`)
    })

    t.test(`${t.name}: medium data`, (t) => {
      t.plan(3)
      const data = crypto.randomBytes(2000)
      const s3Keys = s3Helper.encodeDataToS3KeyArray(s3Prefix, data)
      t.assert(
        s3Keys.every((key) => { return key.length <= 1024 }),
        `${t.name} encoded s3 keys are all under the limit`
      )
      const parts = s3Keys.map((key) => {
        return s3Helper.parseS3Key(key).recordPartString
      })
      const partsAll = ''.concat(parts)
      const decodedData = s3Helper.s3StringToByteArray(partsAll)
      t.deepEqual(decodedData, data, `${t.name} encode/decodes correctly`)
      const dataCrc = radix64.fromNumber(crc.crc32.unsigned(decodedData.buffer))
      const recordCrc = s3Helper.parseS3Key(s3Keys[0]).recordCrc
      t.equal(recordCrc, dataCrc, `${t.name} checksum ok`)
    })

    t.test(`${t.name}: big data`, (t) => {
      t.plan(1)
      const data = crypto.randomBytes(51000)
      t.throws(() => {
        s3Helper.encodeDataToS3KeyArray(s3Prefix, data)
      }, `${t.name} throws`)
    })
  })
})
