# Contributing to FingerprintJS Pro React Native integration

## Development Environment
Before starting work on repository please configure environment and emulators. You can find complete instruction [here](https://reactnative.dev/docs/environment-setup).

## Development playground

In `TestProject` folder you can find demo application. React Native provides not the best developer experience so please follow the steps.

#### Common steps

1. Run `yarn install` in the project root.
2. Go to the `TestProject` folder and run `yarn install` here.
3. Go back to project root, and run `yarn build`.
4. After build is done, run `sync.sh` to copy references of the library into the Test project.
5. Go to `TestProject` folder.
3. Set environment variable `PUBLIC_API_KEY`, you can just use `.env` [approach](https://www.npmjs.com/package/dotenv).
4. Run `yarn start`. From this moment it will keep your terminal.

#### Android
1. Run emulator in Android Studio or connect your device. You can check connected devices with `/android/sdk/platform-tools/adb devices` command.
2. Run `yarn android` from `TestProject` folder.
3. You should see the running app in emulator or device.

### iOS
1. Run `pod install` in `TestProject/ios` folder.
2. Run `yarn ios` from `TestProject` folder. You may need to run `pod install --repo-update` if you face errors.
3. You should see the running app in a simulator.

#### Troubleshooting
1. Try `yarn start --reset-cache`.
2. Try relaunch emulator/simulator or reconnect your device.
3. Try to delete both `node_modules` and install dependencies again in order from [common steps](#common-steps).

#### Hot reload
React native instruments don't support `npm`/`yarn` links for packages, because of this each library update needs not only building this library but reinstalling module for demo app. Current repository have 2 ways to make development more comfortable.

1. Change `"main"` section in library's `package.json` to `"./src/index.ts"`. With this fix you don't need to build library for getting updates in `TestApp`, but don't forget to revert this change.
2. Run `sync.sh` script, it will sync `src`, `build`, `ios` and `android` folder between library and library copy in TestApp `node_modules` folder.
