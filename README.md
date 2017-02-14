# Brave Sync

[![Build
Status](https://travis-ci.org/brave/sync.svg?branch=master)](https://travis-ci.org/brave/sync)

A client/server for Brave sync

## Building

[Yarn](https://yarnpkg.com/) must be installed first, though npm and yarn will both work for the commands below. If you're adding packages to package.json, please `yarn install` and commit changes to yarn.lock.

Install dependencies:

```
yarn install
```

Build a bundled JS library for the client:

```
yarn run build
```

Run the server:

```sh
yarn run start
```

## Testing

The sync client uses Browserify to transform Node js into browser js. To unittest
the library in a browser (default: electron), run `yarn browsertest`.
To test in a different browser run `yarn browsertest -- --browser chrome`.
Results appear in both the browser inspector and your terminal.

To run tests in Node, just do `yarn test`.

To do a basic client/server integration test against the production server, run
`npm run client` and navigate to `http://localhost:8000/`). The page
should not show any 'ERROR' messages and should end with 'success'.

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
yarn run start-dev
```

### Client integration

To integrate Brave sync on a platform (iOS, Android, Laptop):

1. Make a new branch.
2. In the main browser process, implement an IPC message handler as specified
   in `client/constants/messages.js`.
3. If webviews on your platform do not support `chrome.ipcRenderer.{send, on}`,
   edit `client/polyfill/chrome.js` as needed to polyfill this functionality.

#### Building for browser-laptop

1. Make sure this repo is checked out next to `browser-laptop/`
2. Checkout the `feature/syncing` branch in browser-laptop
3. `npm run dist`
4. If developing, do `npm start` in browser-laptop. Console messages from the
   sync client will be logged in `Library/Application
   Support/brave-development/chrome-debug.log`.

### Tests

To run tests you need to configure these environment variables:

- AWS_REGION
- AWS_S3_BUCKET
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
