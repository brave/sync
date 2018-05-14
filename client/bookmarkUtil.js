'use strict'

/**
 * Returns a base bookmark order based on deviceId and platform.
 * @param {String} deviceId
 * @param {String} platform
 * @returns {String}
 */
module.exports.getBaseBookmarksOrder = (deviceId, platform) => {
  return `${(platform === 'ios' || platform === 'android') ? 2 : 1}.${deviceId}.`
}

/**
 * Returns current bookmark order based on previous and next bookmark order.
 * @param {String} prevOrder
 * @param {String} nextOrder
 * @returns {String}
 */
module.exports.getBookmarkOrder = (prevOrder, nextOrder) => {
  let prevOrderSplit = prevOrder.split('.')
  let nextOrderSplit = nextOrder.split('.')
  if (prevOrderSplit.length === 1 && nextOrderSplit.length === 1) {
    throw new Error(`Invalid previous and next orders: ${prevOrderSplit} and ${nextOrderSplit}`)
  }
  let order = ''
  if (nextOrderSplit.length === 1) {
  // Next order is an empty string
    if (prevOrderSplit.length > 2) {
      for (var i = 0; i < prevOrderSplit.length - 1; i++) {
        order += prevOrderSplit[i] + '.'
      }
      order += (parseInt(prevOrderSplit[prevOrderSplit.length - 1]) + 1)
    }
  } else if (prevOrderSplit.length === 1) {
    if (nextOrderSplit.length > 2) {
      for (i = 0; i < nextOrderSplit.length - 1; i++) {
        order += nextOrderSplit[i] + '.'
      }
      let lastNumber = parseInt(nextOrderSplit[nextOrderSplit.length - 1])
      if (lastNumber === 1) {
        order += '0.1'
      } else {
        order += (parseInt(nextOrderSplit[nextOrderSplit.length - 1]) - 1)
      }
    }
  } else {
    if (prevOrderSplit.length > 2 && nextOrderSplit.length > 2) {
      for (i = 0; i < prevOrderSplit.length - 1; i++) {
        order += prevOrderSplit[i] + '.'
      }
      if (prevOrderSplit.length === nextOrderSplit.length) {
        let lastNumberPrev = parseInt(prevOrderSplit[prevOrderSplit.length - 1])
        let lastNumberNext = parseInt(nextOrderSplit[nextOrderSplit.length - 1])
        if (lastNumberNext - lastNumberPrev > 1) {
          order += (lastNumberPrev + 1)
        } else {
          order += lastNumberPrev + '.1'
        }
      } else if (prevOrderSplit.length < nextOrderSplit.length) {
        order += prevOrderSplit[prevOrderSplit.length - 1] + '.'
        let currentIndex = prevOrderSplit.length
        while (parseInt(nextOrderSplit[currentIndex]) === 0) {
          order += nextOrderSplit[currentIndex] + '.'
          currentIndex++
        }
        if (parseInt(nextOrderSplit[currentIndex]) === 1) {
          order += '0.1'
        } else if (parseInt(nextOrderSplit[currentIndex]) !== 0) {
          order += (parseInt(nextOrderSplit[currentIndex]) - 1)
        }
      } else {
        order += (parseInt(prevOrderSplit[prevOrderSplit.length - 1]) + 1)
      }
    }
  }
  return order
}
