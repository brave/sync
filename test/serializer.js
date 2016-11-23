const test = require('tape')
const serializer = require('../lib/serializer')

test('init', (t) => {
  t.plan(1)
  serializer.init('nonexistent').catch((e) => {
    t.ok(e.message.includes('no such file'))
  })
})

test('serializing strings', (t) => {
  const messages = ['€ are my favorite moneys', 'hello world',
    'test abc     ', '']
  t.plan(4)
  serializer.init().then((s) => {
    messages.forEach((msg) => {
      const bytes = s.stringToByteArray(msg)
      t.equal(msg, s.byteArrayToString(bytes))
    })
  })
})
