// This file contains useful helper functions to make writing tests more fun!

/**
 * A deterministic seed
 * @returns {Uint8Array}
 */
module.exports.cryptoSeed = () => {
  return new Uint8Array([243, 203, 185, 143, 101, 184, 134, 109, 69, 166, 218, 58, 63, 155, 158, 17, 31, 184, 175, 52, 73, 80, 190, 47, 45, 12, 59, 64, 130, 13, 146, 248])
}
