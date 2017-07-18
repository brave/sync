/**
 * This file includes base config vars.
 * Additional config comes from the browser client when it initializes sync.
 */

module.exports = {
  // 2-byte encryption nonce counter, rotated periodically
  nonceCounter: 0,
  // Sync library version, updated every brave/sync release
  syncVersion: 'v1.3.5'
}
