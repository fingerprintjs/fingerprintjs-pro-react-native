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

[Fingerprint](https://fingerprint.com/) is a device intelligence platform offering 99.5% accurate visitor
identification. Fingerprint Pro React Native SDK is an easy way to integrate Fingerprint Pro into your React Native
application to call the native Fingerprint Pro libraries (Android and iOS) and identify devices.

## Table of contents
- [Fingerprint Pro React Native](#fingerprint-pro-react-native)
  - [Table of contents](#table-of-contents)
  - [Requirements and limitations](#requirements-and-limitations)
  - [Dependencies](#dependencies)
  - [How to install](#how-to-install)
    - [1. Install the package using your favorite package manager:](#1-install-the-package-using-your-favorite-package-manager)
    - [2. Configure iOS dependencies](#2-configure-ios-dependencies)
    - [3. Configure Android dependencies](#3-configure-android-dependencies)
      - [Gradle versions before 7.0](#gradle-versions-before-70)
      - [Gradle versions 7.0 and higher](#gradle-versions-70-and-higher)
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

- React Native 0.73 or higher
- Android 5.0 (API level 21+) or higher
- iOS 13+/tvOS 15+, Swift 5.7 or higher (stable releases)


- Fingerprint Pro [request filtering](https://dev.fingerprint.com/docs/request-filtering) is not supported right now. Allowed and forbidden origins cannot be used.
- Usage inside the [Expo environment](https://docs.expo.dev) is not supported right now.

## Dependencies
- [Fingerprint Pro iOS](https://github.com/fingerprintjs/fingerprintjs-pro-ios)
- [Fingerprint Pro Android](https://github.com/fingerprintjs/fingerprintjs-pro-android)

## How to install

### 1. Install the package using your favorite package manager:

* [NPM](https://npmjs.org):
  ```shell
  npm install @fingerprintjs/fingerprintjs-pro-react-native --save
  ```

* [Yarn](https://yarnpkg.com):
  ```shell
  yarn add @fingerprintjs/fingerprintjs-pro-react-native
  ```

* [PNPM](https://pnpm.js.org):
  ```shell
  pnpm add @fingerprintjs/fingerprintjs-pro-react-native
  ```

### 2. Configure iOS dependencies


  ```shell
  cd ios && pod install
  ```

### 3. Configure Android dependencies

To declare the Fingerprint Maven repository, add the following declarations:
```groovy
maven {
  url("https://maven.fpregistry.io/releases")
}
maven {
  url("https://www.jitpack.io")
}
```

Add the repositories to your Gradle configuration file. The location for these additions depends on your project's structure and the Gradle version you're using:

#### Gradle versions before 7.0

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
    maven {
      url("https://www.jitpack.io") // Add this
    }
    google()
  }
}
```

#### Gradle versions 7.0 and higher

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
  maven {
    url("https://www.jitpack.io")  // Add this
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

const WrappedApp = () => (
    <FingerprintJsProProvider
        apiKey={'your-fpjs-public-api-key'}
        region={'eu'}
    >
        <App />
    </FingerprintJsProProvider>
);

AppRegistry.registerComponent('AppName', () => WrappedApp);
```

Use the `useVisitorData` hook in your components to perform visitor identification and get the data.

```javascript
// src/App.js
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native';

function App() {
  const {
    isLoading,
    error,
    data,
    getData,
  } = useVisitorData();

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>An error occured: {error.message}</Text>;
  }

  if (data) {
    // perform some logic based on the visitor data
    return (
      <Text>
        Visitor id is {data.visitorId}
      </Text>
    );
  } else {
    return null;
  }
}

export default App;
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
const FingerprintClient = new FingerprintJsProAgent({ apiKey: 'PUBLIC_API_KEY', region: 'eu', extendedResponseFormat: true }); // Region may be 'us', 'eu', or 'ap'
// =================================================================================================^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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

