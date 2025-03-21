# E2E-App

This application is used for running E2E tests via [Detox](https://github.com/wix/Detox)
and was bootstraped using [Expo](https://expo.dev).

## Get started

To install dependencies, run:

   ```bash
   yarn install
   ```

The app is intended to run via Detox. To learn more, head to the sections below.

## Running iOS tests

### Prerequisites
- [React-Native Prerequisites](https://reactnative.dev/docs/next/set-up-your-environment?platform=ios)
- [Detox Prerequisites](https://wix.github.io/Detox/docs/introduction/environment-setup)
- Device running the latest MacOS version
- Running `iPhone 16` simulator

> To use different simulator, update the `devices.simulator.device.type` value in `.detoxrc.js`

### 1. Building the app
```bash
npx detox build --configuration ios.sim.release
```
When debugging tests locally, it is recommended to use ios.sim.debug for faster build and easier logs access.
```bash
npx detox build --configuration ios.sim.debug
```

### 2. Running tests
```bash
npx detox test --configuration ios.sim.release
```

The configuration passed via `--configuration` must match the one used in `detox build`.

> If you're using `ios.sim.debug` configuration, don't forget to run `yarn start` to start the bundler before running tests.

## Running android tests

### Prerequisites
- [React-Native Prerequisites](https://reactnative.dev/docs/next/set-up-your-environment?platform=android)
- [Detox Prerequisites](https://wix.github.io/Detox/docs/introduction/environment-setup)
- Running `Pixel 9 API 35` simulator

> To use different simulator, update the `devices.emulator.device.avdName` value in `.detoxrc.js`

### 1. Building the app
```bash
npx detox build --configuration android.emu.release
```
When debugging tests locally, it is recommended to use `android.emu.debug` for faster build and easier logs access.
```bash
npx detox build --configuration android.emu.debug
```

### 2. Running tests
```bash
npx detox test --configuration android.emu.release
```

The configuration passed via `--configuration` must match the one used in `detox build`.

> If you're using `android.emu.debug` configuration, don't forget to run `yarn start` to start the bundler before running tests.

## Dealing with native code

Every action that affects native code, such as updating `react-native` or installing a native library, requires running `yarn prebuild` to regenerate native code located in `ios` and `android`.

To learn more, head to [expo docs about Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/#cng-in-react-native-apps).

## Debugging failing tests on GitHub actions

Failed tests generate artifacts specific for tested platform:
- `android-detox-artifacts` and `ios-detox-artifacts` contain details about tests itself, device logs and videos of the test session.
- `android-app-release` and `ios-app-release` contain built app that can be installed on simulator and tested locally.