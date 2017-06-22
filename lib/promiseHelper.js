'use strict'

/**
 * Wrap a Promise-returning function so calls to it fill a queue which has
 * a concurrency limit.
 * e.g. there is an API rate limited to 10 concurrent connections.
 * const getApi = (arg) => window.fetch(arg)
 * const throttledGetApi = limitConcurrency(getApi, 10)
 * for (let i; i < 1000; i++) { throttledGetApi(i) }
 * @param fn {function} Function which returns a Promise
 * @param concurrency {number} Maximum pending/concurrent fn calls
 * @returns {function}
 */
module.exports.limitConcurrency = function (fn, concurrency) {
  var queue = null
  var active = []
  const enqueueFnFactory = function (_this, args) {
    return function () {
      const enqueued = fn.apply(_this, args)
      enqueued.then(function () {
        active.splice(active.indexOf(enqueued), 1)
      })
      active.push(enqueued)
      return {
        enqueued,
        newQueue: Promise.race(active)
      }
    }
  }
  return function () {
    var enqueueFn = enqueueFnFactory(this, arguments)
    if (active.length < concurrency) {
      const promises = enqueueFn()
      queue = promises.newQueue
      return promises.enqueued
    } else {
      const advanceQueue = queue.then(enqueueFn)
      queue = advanceQueue.then(promises => promises.newQueue)
      return advanceQueue.then(promises => promises.enqueued)
    }
  }
}
