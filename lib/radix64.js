'use strict'

// inspiration
// https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript

const DIGITS_STRING =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-'
// 0       8       16      24      32      40      48      56     63
const DIGITS_ARRAY = DIGITS_STRING.split('')

/**
 * This cannot handle negative numbers and only works on the
 * integer part, discarding the fractional part.
 * @param {number}
 * @returns {string}
 */
module.exports.fromNumber = function (number) {
  if (isNaN(Number(number)) || number === null ||
    number === Number.POSITIVE_INFINITY) {
    throw new Error('Invalid number')
  }
  if (number < 0) {
    throw new Error('Can\'t represent negative numbers')
  }

  let rixit // like 'digit', only in some non-decimal radix
  let residual = Math.floor(number)
  let result = ''
  while (true) {
    rixit = residual % 64
    result = DIGITS_STRING.charAt(rixit) + result
    residual = Math.floor(residual / 64)
    if (residual === 0) { break }
  }
  return result
}

/**
 * @param {string}
 * @returns {number}
 */
module.exports.toNumber = function (rixits) {
  var result = 0
  for (let e = 0; e < DIGITS_ARRAY.length; e++) {
    result = (result * 64) + DIGITS_STRING.indexOf(rixits[e])
  }
  return result
}
