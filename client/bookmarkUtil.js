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
 * Helper to get next order number.
 * @param {array} prevIntArr - int array representing prev order
 * @return {string}
 */
const getNextOrderFromPrevOrder = (prevIntArr) => {
  if (prevIntArr.length <= 2) {
    throw new Error('Invalid input order')
  }
  const lastNumber = prevIntArr[prevIntArr.length - 1]
  if (lastNumber <= 0) {
    throw new Error('Invalid input order')
  } else {
    prevIntArr[prevIntArr.length - 1]++
    return toOrderString(prevIntArr)
  }
}

/**
 * Helper to get previous order number.
 * @param {array} nextIntArr - int array representing next order
 * @return {string}
 */
const getPrevOrderFromNextOrder = (nextIntArr) => {
  const lastNumber = nextIntArr[nextIntArr.length - 1]
  nextIntArr.length = nextIntArr.length - 1
  if (lastNumber <= 0) {
    throw new Error('Invalid input order')
  } else if (lastNumber === 1) {
    return toOrderString(nextIntArr) + '.0.1'
  } else {
    nextIntArr.push(lastNumber - 1)
    return toOrderString(nextIntArr)
  }
}

/**
 * Helper to convert order from string to int array.
 * @param {string} s - string representing order
 * @return {array}
 */
const orderToIntArray = (s) => {
  if (!s) {
    return []
  }

  const arrayS = s.split('.')
  const arrayInt = arrayS.map(s => parseInt(s, 10))
  return arrayInt
}

/**
 * Helper to convert order from int array to string .
 * @param {string} s - int array representing order
 * @return {array}
 */
const toOrderString = (arrayInt) => {
  return arrayInt.join('.')
}

/**
 * Helper to lexicographical compare orders represented by int array. Exported for tests.
 * @param {array} leftIntVec - int array representing left order to compare
 * @param {array} rightIntVec - int array representing right order to compare
 * @return {bool} - true if leftIntVec < rightIntVec
 */
module.exports.compareIntVecOrders = (leftIntVec, rightIntVec) => {
  var iLeft = 0
  var iRight = 0
  for (; iLeft < leftIntVec.length && iRight < rightIntVec.length; ++iLeft, ++iRight) {
    if (leftIntVec[iLeft] < rightIntVec[iRight]) return true
    if (rightIntVec[iRight] < leftIntVec[iLeft]) return false
  }
  return (iLeft === leftIntVec.length) && (iRight !== rightIntVec.length)
}

const compareIntVecOrders = module.exports.compareIntVecOrders

/**
 * Helper to lexicographical compare orders represented by strings. Exported for tests.
 * @param {array} leftIntVec - int array representing left order to compare
 * @param {array} rightIntVec - int array representing right order to compare
 * @return {bool} - true if leftIntVec < rightIntVec
 */
module.exports.compareStringOrders = (leftOrder, rightOrder) => {
  return compareIntVecOrders(orderToIntArray(leftOrder), orderToIntArray(rightOrder))
}

/**
 * Returns current bookmark order based on previous and next bookmark order.
 * @param {String} prevOrder
 * @param {String} nextOrder
 * @param {String} parentOrder
 * @returns {String}
 */
module.exports.getBookmarkOrder = (prevOrder, nextOrder, parentOrder) => {
  const prevIntArr = orderToIntArray(prevOrder)
  const nextIntArr = orderToIntArray(nextOrder)
  if (!prevIntArr.length && !nextIntArr.length) {
    if (!parentOrder) {
      throw new Error(`Invalid previous, next and parent orders: ${prevOrder}, ${nextOrder} and ${parentOrder}`)
    } else {
      return parentOrder + '.1'
    }
  } else if (!prevIntArr.length && nextIntArr.length) {
    return getPrevOrderFromNextOrder(nextIntArr)
  } else if (prevIntArr.length && !nextIntArr.length) {
    return getNextOrderFromPrevOrder(prevIntArr)
  } else {
    // Both prev and next are not empty
    if (!compareIntVecOrders(prevIntArr, nextIntArr)) {
      throw new Error(`Invalid input, prevOrder should be less then nextOrder, prevOrder=${prevOrder}, prevOrder=${nextOrder}`)
    }

    // Assume prev looks as a.b.c.d
    // result candidates are:
    // a.b.c.(d+1)
    // a.b.c.d.1
    // a.b.c.d.0.1
    // a.b.c.d.0.0.1
    // ...
    // each of them is greater than prev

    // Length of result in worse case can be one segment longer
    // than length of next
    // And result should be < next

    var resultIntArr = prevIntArr.slice()
    resultIntArr[resultIntArr.length - 1]++
    // Case a.b.c.(d+1)
    if (compareIntVecOrders(resultIntArr, nextIntArr)) {
      return toOrderString(resultIntArr)
    }
    resultIntArr = prevIntArr.slice()
    resultIntArr.push(1)
    if (compareIntVecOrders(resultIntArr, nextIntArr)) {
      return toOrderString(resultIntArr)
    }
    const insertAt = prevIntArr.length
    const tryUntilSize = nextIntArr.length + 1
    while (resultIntArr.length < tryUntilSize) {
      resultIntArr.splice(insertAt, 0, 0)
      if (compareIntVecOrders(resultIntArr, nextIntArr)) {
        return toOrderString(resultIntArr)
      }
    }
  }

  throw new Error(`Invalid previous, next and parent orders: ${prevOrder}, ${nextOrder} and ${parentOrder}`)
}
