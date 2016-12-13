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

The sync client uses Browserify to transform Node js into browser js. To unittest
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

### Client integration

To integrate Brave sync on a platform (iOS, Android, Laptop):

1. Fork this repo
2. Edit `client/config.js` and set `clientOrigin` to the origin where the sync
   webview will be running, if something other than `http://localhost:8000`.
3. Edit `corsOptions` in `server/users.js` to add the origin from Step 2.
   Open a PR in brave/sync with this change. Once accepted, the production sync
   server will be able to accept requests from your platform.
4. In the main browser process, implement an IPC message handler as specified
   in `client/constants/messages.js`.
5. If webviews on your platform do not support `chrome.ipc.{send, on}`,
   edit `client/polyfill/chrome.js` as needed to polyfill this functionality.
