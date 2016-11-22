const test = require('tape')
const serializer = require('../lib/serializer')

test('serializing strings', (t) => {
  const messages = ['€ are my favorite moneys', 'hello world',
    'test abc     ', '']
  t.plan(4)
  messages.forEach((msg) => {
    const bytes = serializer.stringToByteArray(msg)
    t.equal(msg, serializer.byteArrayToString(bytes))
  })
})
