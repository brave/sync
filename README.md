# Brave Sync Client

[![Build
Status](https://travis-ci.com/brave/sync-client.svg?token=Z9Cjdxe1hxpZUxkophZN&branch=master)](https://travis-ci.com/brave/sync-client)

A client for Brave sync

## Building

`npm install`

## Testing

The sync client uses Browserify to transform Node js into browser js. To test
the library in your browser, run `npm run browsertest`, navigate to the
local address printed in the terminal (default `http://localhost:8000/`),
and open the page console to see test output.

To run tests in Node, just do `npm test`.
