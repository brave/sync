# Brave Sync

[![Build
Status](https://travis-ci.org/brave/sync.svg?branch=master)](https://travis-ci.org/brave/sync)

A client/server for Brave sync

## Building

Both npm and [yarn](https://yarnpkg.com/) should work. If you're adding packages to package.json, please `yarn install` and commit changes to yarn.lock.

Install dependencies:

```
npm install
```

Build a bundled JS library for the client:

```
npm run build
```

Run the server:

```sh
npm start
```

## Testing

The sync client uses Browserify to transform Node js into browser js. To test
the library in your browser, run `npm run browsertest`, navigate to the
local address printed in the terminal (default `http://localhost:8000/`),
and open the page console to see test output.

To run tests in Node, just do `npm test`.

## Development

### Server

`server/config` contains settings; defaults in defaults.json and environment variable mappings in custom-environment-variables.json.

To configure locally you can create a file `config-dev.sh` and `source config-dev.sh` when needed:

```sh
#!/bin/bash
export AWS_ACCESS_KEY_ID="{stuff}"
export AWS_SECRET_ACCESS_KEY="{secret stuff}"
```

Run the server with file watching and autoreloading:
```sh
npm start-dev
```
