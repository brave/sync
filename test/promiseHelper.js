const test = require('tape')
const promiseHelper = require('../lib/promiseHelper')

test('promiseHelper', (t) => {
  t.plan(1)

  t.test('limitConcurrency', (t) => {
    t.plan(1)

    t.test('calls the original function the same number of times with correct args', (t) => {
      t.plan(2)
      const EXPECTED_CALL_COUNT = 100
      let callCount = 0
      const asyncFun = (i) => new Promise((resolve, reject) => {
        setTimeout(() => {
          callCount += 1
          resolve(i)
        }, Math.round(10 * Math.random()))
      })
      const throttedAsyncFun = promiseHelper.limitConcurrency(asyncFun, 3)
      const promises = []
      let expectedSum = 0
      for (let i = 0; i < EXPECTED_CALL_COUNT; i++) {
        promises.push(throttedAsyncFun(i))
        expectedSum += i
      }
      Promise.all(promises).then((results) => {
        const sum = results.reduce((a, b) => a + b)
        t.equal(callCount, EXPECTED_CALL_COUNT)
        t.equal(sum, expectedSum)
      })
    })
  })
})
