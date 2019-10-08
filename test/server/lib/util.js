const Util = require('../../../server/lib/util')
const test = require('tape')

test('utils', (t) => {
  t.test('parseUA', (q) => {
    q.plan(7)
    q.deepEquals(['windows', 'other'], Util.parseUA('Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'))
    q.deepEquals(['android', 'other'], Util.parseUA('Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'))
    q.deepEquals(['mac', 'chrome'], Util.parseUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36'))
    q.deepEquals(['android', 'other'], Util.parseUA('Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'))
    q.deepEquals(['ios', 'other'], Util.parseUA('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'))
    q.deepEquals(['linux', 'other'], Util.parseUA('Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/33.0'))
    q.deepEquals(['other', 'chrome'], Util.parseUA('Mozilla/5.0 (X11; U; CrOS i686 9.10.0; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.253.0 Safari/532.5'))
  })
})
