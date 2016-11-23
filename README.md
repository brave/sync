# Brave Sync

[![Build
Status](https://travis-ci.org/brave/sync.svg?branch=master)](https://travis-ci.org/brave/sync)

A client/server for Brave sync

## Building

Install dependencies:

```
npm install
```

Build a bundled JS library for the client:

```
npm run build
```

Run the server (TODO):

```
npm start
```

## Testing

The sync client uses Browserify to transform Node js into browser js. To test
the library in your browser, run `npm run browsertest`, navigate to the
local address printed in the terminal (default `http://localhost:8000/`),
and open the page console to see test output.

To run tests in Node, just do `npm test`.
