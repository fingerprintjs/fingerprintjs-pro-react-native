# Contributing to FingerprintJS Pro React Native integration

## Development Environment
Before starting work on repository please configure environment and emulators. You can find complete instruction [here](https://reactnative.dev/docs/environment-setup).

## Development playground

In `TestProject` folder you can find demo application. React Native provides not the best developer experience so please follow the steps.

#### Common steps

1. Run `yarn install` in the project root.
2. Go to the `TestProject` folder and run yarn install here.
3. Set up `apiKey` in `App.js`. (TODO: use environment variable).
4. Run `yarn start`. From this moment it will keep your terminal.

#### Android
1. Run emulator in Android Studio or connect your device.
2. Run `yarn android` from TestProject` folder.
3. You should see working app in emulator.

#### Troubleshooting
1. Try `yarn start --reset-cache`
2. Try relaunch emulator
3. Try to delete both `node_modules` and install dependencies again in order from [common steps](#common-steps)

#### Hot reload
React native instruments don't support `npm`/`yarn` links for packages, because of this each library update needs not only building this library but reinstalling module for demo app. Current repository have 2 ways to make development more comfortable.

1. Change `"main"` section in library's `package.josn` to `"./src/index.ts"`. With this fix you don't need to build library for getting updates in `TestApp`, but don't forget to revert this change.
2. Run `sync.sh` script, it will sync `src` and `build` folder between library and library copy in TestApp `node_modules` folder.
