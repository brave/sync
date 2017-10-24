/**
 * This file includes base config vars.
 * Additional config comes from the browser client when it initializes sync.
 */

module.exports = {
  PUT_CONCURRENCY: 100,
  SERVICES_MAX_RETRIES: 1,
  EXPIRED_CREDENTIAL_ERRORS: [
    /The provided token has expired\./,
    /Invalid according to Policy: Policy expired\./,
    /The security token included in the request is expired/
  ],
  // Maximum amount of messages to receive from SQS
  SQS_MAX_LIST_MESSAGES_COUNT: 10,
  // How many seconds messages will be invisible for another poll
  SQS_MESSAGES_VISIBILITY_TIMEOUT: 30,  // In seconds
  // How many seconds we should wait for messages
  SQS_MESSAGES_LONGPOLL_TIMEOUT: 3,  // In seconds
  // 2-byte encryption nonce counter, rotated periodically
  nonceCounter: 0,
  // Sync library version, updated every brave/sync release
  syncVersion: 'v1.4.2'
}
