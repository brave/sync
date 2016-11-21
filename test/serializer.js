/* global describe, it */

const assert = require('assert')
const serializer = require('../lib/serializer')

describe('serializing strings', () => {
  const messages = ['€ are my favorite moneys', 'hello world',
    'test abc     ', '']
  it('deserializes to original message', () => {
    messages.forEach((msg) => {
      const bytes = serializer.stringToByteArray(msg)
      assert.equal(msg, serializer.byteArrayToString(bytes))
    })
  })
})
