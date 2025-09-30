<p align="center">
  <a href="https://fingerprint.com">
    <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://fingerprintjs.github.io/home/resources/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://fingerprintjs.github.io/home/resources/logo_dark.svg" />
     <img src="https://fingerprintjs.github.io/home/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
</p>
<p align="center">
  <a href="https://fingerprintjs.github.io/fingerprintjs-pro-react-native/coverage/">
    <img src="https://fingerprintjs.github.io/fingerprintjs-pro-react-native/coverage/badges.svg" alt="coverage">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-react-native">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-react-native.svg?style=flat" alt="Current NPM version"/>
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-react-native">
    <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-react-native.svg" alt="Monthly downloads from NPM">
  </a>
   <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/:license-mit-blue.svg?style=flat"/>
  </a>
  <a href="https://discord.gg/39EpE2neBg">
    <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
  </a>
    <a href="https://fingerprintjs.github.io/fingerprintjs-pro-react-native/">
      <img src="https://img.shields.io/badge/-Documentation-green" alt="Discord server">
    </a>
</p>

# Fingerprint Pro React Native

[Fingerprint](https://fingerprint.com/) is a device intelligence platform offering industry-leading accuracy.
Fingerprint Pro React Native SDK is an easy way to integrate Fingerprint Pro into your React Native
application to call the native Fingerprint Pro libraries (Android and iOS) and identify devices.

## Table of contents

- [Fingerprint Pro React Native](#fingerprint-pro-react-native)
  - [Table of contents](#table-of-contents)
  - [Requirements and limitations](#requirements-and-limitations)
  - [Dependencies](#dependencies)
  - [How to install](#how-to-install)
    - [Expo setup](#expo-setup)
        - [1. Add config plugin](#1-add-config-plugin)
        - [2. Rebuild the native code](#2-rebuild-the-native-code)
        - [3. Rebuild the app](#3-rebuild-the-app)
    - [Bare react-native](#bare-react-native-setup)
      - [1. Configure iOS dependencies (if developing on iOS)](#1-configure-ios-dependencies-if-developing-on-ios)
      - [2. Configure Android dependencies (if developing on Android)](#2-configure-android-dependencies-if-developing-on-android)
        - [Gradle 7 or newer](#gradle-7-or-newer)
        - [Gradle 6.0 or older](#gradle-60-or-older)
  - [Usage](#usage)
    - [Hooks approach](#hooks-approach)
    - [API Client approach](#api-client-approach)
    - [`extendedResponseFormat`](#extendedresponseformat)
    - [Linking and tagging information](#linking-and-tagging-information)
  - [API Reference](#api-reference)
  - [Additional Resources](#additional-resources)
  - [Support and feedback](#support-and-feedback)
  - [License](#license)

## Requirements and limitations

- React Native versions 0.73 through 0.81 are supported
- Expo 51.0.0 or higher is supported
- Android 5.0 (API level 21+) or higher
- iOS 13+/tvOS 15+, Swift 5.7 or higher (stable releases)

- Fingerprint Pro [request filtering](https://dev.fingerprint.com/docs/request-filtering) is not supported right now. Allowed and forbidden origins cannot be used.
- Usage inside the [Expo environment](https://docs.expo.dev) is not supported right now.

## Dependencies

- [Fingerprint Pro iOS](https://github.com/fingerprintjs/fingerprintjs-pro-ios)
- [Fingerprint Pro Android](https://github.com/fingerprintjs/fingerprintjs-pro-android)

## How to install

Install the package using your favorite package manager:

- [NPM](https://npmjs.org):

  ```shell
  npm install @fingerprintjs/fingerprintjs-pro-react-native --save
  ```

- [Yarn](https://yarnpkg.com):

  ```shell
  yarn add @fingerprintjs/fingerprintjs-pro-react-native
  ```

- [PNPM](https://pnpm.js.org):
  ```shell
  pnpm add @fingerprintjs/fingerprintjs-pro-react-native
  ```
  
## Expo setup

> ℹ️ Our SDK cannot be used in [Expo Go](https://expo.dev/go) because it requires custom native code.

<details>
<summary>Web support</summary>
To use the SDK on the web, install the peer dependency with your preferred package manager:

- [NPM](https://npmjs.org):

  ```shell
  npm install @fingerprintjs/fingerprintjs-pro-spa --save
  ```

- [Yarn](https://yarnpkg.com):

  ```shell
  yarn add @fingerprintjs/fingerprintjs-pro-spa
  ```

- [PNPM](https://pnpm.js.org):
  ```shell
  pnpm add @fingerprintjs/fingerprintjs-pro-spa
  ```
  
Then, use the SDK as you would with the native version.
</details>

### 1. Add config plugin
```json
{
  "expo": {
    "plugins": [
      "@fingerprintjs/fingerprintjs-pro-react-native"
    ]
  }
}
```

### 2. Rebuild the native code
```bash
npx expo prebuild --clean
```

### 3. Rebuild the app
For Android:
```bash
npx expo run:android
```

For iOS:
```bash
npx expo run:ios
```
  
## Bare react-native setup

### 1. Configure iOS dependencies (if developing on iOS)

```shell
cd ios && pod install
```

### 2. Configure Android dependencies (if developing on Android)

Add the repositories to your Gradle configuration file. The location for these additions depends on your project's structure and the Gradle version you're using:

#### Gradle 7 or newer

For Gradle 7.0 and higher (if you've adopted [the new Gradle settings file approach](https://developer.android.com/build#settings-file)), you likely manage repositories in the `dependencyResolutionManagement` block in `{rootDir}/android/settings.gradle`. Add the Maven repositories in this block:

```groovy
dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
  repositories {
    google()
    mavenCentral()
    maven {
      url("https://maven.fpregistry.io/releases") // Add this
    }
  }
}
```

#### Gradle 6.0 or older

For Gradle versions before 7.0, you likely have an `allprojects` block in `{rootDir}/android/build.gradle`. Add the Maven repositories within this block:

```groovy
allprojects {
    repositories {
      mavenCentral()
      mavenLocal()
      maven {
        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
        url("$rootDir/../node_modules/react-native/android")
      }
      maven {
        // Android JSC is installed from npm
        url("$rootDir/../node_modules/jsc-android/dist")
      }
      maven {
        url("https://maven.fpregistry.io/releases") // Add this
      }
      google()
    }
}
```

## Usage

To identify visitors, you need a Fingerprint Pro account (you can [sign up for free](https://dashboard.fingerprint.com/signup/)).

- Go to [the Fingerprint Pro dashboard](https://dashboard.fingerprint.com/).
- Open **App Settings** > **API Keys** to find your Public API key.

### Hooks approach

Configure the SDK by wrapping your application in FingerprintJsProProvider.

```javascript
// src/index.js
import React from 'react';
import { AppRegistry } from 'react-native';
import { FingerprintJsProProvider } from '@fingerprintjs/fingerprintjs-pro-react-native';
import App from './App';
import { name as appName } from './app.json';

const WrappedApp = () => (
  <FingerprintJsProProvider apiKey={'your-fpjs-public-api-key'} region={'eu'}>
    <App />
  </FingerprintJsProProvider>
)

AppRegistry.registerComponent(appName, () => WrappedApp);
```

Use the `useVisitorData` hook in your components to perform visitor identification and get the data.

```javascript
// src/App.js
import React from 'react'
import {Button, SafeAreaView, Text, View} from 'react-native'
import {useVisitorData} from '@fingerprintjs/fingerprintjs-pro-react-native'

export default function App() {
  const {isLoading, error, data, getData} = useVisitorData()

  return (
    <SafeAreaView>
      <View style={{ margin: 8 }}>
        <Button title='Reload data' onPress={() => getData()} />
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text>VisitorId: {data?.visitorId}</Text>
            <Text>Full visitor data:</Text>
            <Text>{error ? error.message : JSON.stringify(data, null, 2)}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
```

### API Client approach

```javascript
import React, { useEffect } from 'react';
import { FingerprintJsProAgent } from '@fingerprintjs/fingerprintjs-pro-react-native';

// ... 

useEffect(() => {
  async function getVisitorInfo() {
    try {
      const FingerprintClient = new FingerprintJsProAgent({ apiKey: 'PUBLIC_API_KEY', region: 'eu' }); // Region may be 'us', 'eu', or 'ap'
      const visitorId = await FingerprintClient.getVisitorId(); // Use this method if you need only visitorId
      const visitorData = await FingerprintClient.getVisitorData(); // Use this method if you need additional information about visitor
      // use visitor data in your code
    } catch (e) {
      console.error('Error: ', e);
    }
  }
  getVisitorInfo();
}, []);
```

### `extendedResponseFormat`

Two types of responses are supported: "default" and "extended". You don't need to pass any parameters to get the "default" response.
"Extended" is an extended result format that includes geolocation, incognito mode and other information.
It can be requested using the `extendedResponseFormat`: true parameter. See more details about the responses in the [documentation](https://dev.fingerprint.com/reference/get-function#extendedresult).

Providing `extendedResponseFormat` using hooks:

```javascript
return (
  <FingerprintJsProProvider apiKey={PUBLIC_API_KEY} extendedResponseFormat={true}>
    <App />
  </FingerprintJsProProvider>
)
```

Providing `extendedResponseFormat` using the API Client:

```javascript
const FingerprintClient = new FingerprintJsProAgent({
  apiKey: 'PUBLIC_API_KEY',
  region: 'eu',
  extendedResponseFormat: true,
})
```

### Linking and tagging information

The `visitorId` provided by Fingerprint Identification is especially useful when combined with information you already know about your users, for example, account IDs, order IDs, etc. To learn more about various applications of the `linkedId` and `tag`, see [Linking and tagging information](https://dev.fingerprint.com/docs/tagging-information).

```javascript
const tag = {
  userAction: 'login',
  analyticsId: 'UA-5555-1111-1'
};
const linkedId = 'user_1234';

// Using hooks
const { getData } = useVisitorData();
const visitorData = await getData(tag, linkedId);

// Using the client
const FingerprintClient = new FingerprintJsProAgent({ apiKey: 'PUBLIC_API_KEY'});
const visitorId = await FingerprintClient.getVisitorId(tag, linkedId);
const visitor = await FingerprintClient.getVisitorData(tag, linkedId); 
```

### Proximity Detection

Proximity detection is a complementary, location-based signal available only on mobile platforms.
You can find more information in [Android SDK documentation](https://dev.fingerprint.com/docs/native-android-integration#proximity-detection-for-android-devices) or in
[iOS SDK documentation](https://dev.fingerprint.com/docs/ios-sdk#using-location-data-for-proximity-detection).

The Fingerprint SDK will only collect location data if the `allowUseOfLocationData` option is set to `true`.

```javascript
return (
  <FingerprintJsProProvider apiKey={PUBLIC_API_KEY} allowUseOfLocationData={true}>
    <App />
  </FingerprintJsProProvider>
)
```

For Android platform it's possible to configure the location retrieval timeout by setting the `locationTimeoutMillisAndroid` option to a desired value. By default, it's set to 5 seconds.
The SDK will delay identification up to the specified timeout to collect the device location. If it cannot collect the location information within the specified time, identification continues without location information.

```javascript
return (
  <FingerprintJsProProvider apiKey={PUBLIC_API_KEY} allowUseOfLocationData={true} locationTimeoutMillisAndroid={10000}>
    <App />
  </FingerprintJsProProvider>
)
```

## API Reference

See the full [generated API Reference](https://fingerprintjs.github.io/fingerprintjs-pro-react-native/).

## Additional Resources

- [Server-to-Server API](https://dev.fingerprint.com/docs/server-api)
- [Fingerprint Pro documentation](https://dev.fingerprint.com/docs)

## Support and feedback

To report problems, ask questions or provide feedback, please
use [Issues](https://github.com/fingerprintjs/fingerprintjs-pro-react-native/issues). If you need private support,
please email us at `oss-support@fingerprint.com`.

## License

This project is licensed under the [MIT license](https://github.com/fingerprintjs/fingerprintjs-pro-react-native/blob/main/LICENSE).

## Changelog

You can find an up-to-date changelog [here](./sdk/CHANGELOG.md).