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
* [Requirements and limitations](#requirements-and-limitations)
* [Dependencies](#dependencies)
* [How to install](#how-to-install)
* [Usage](#usage)
  * [Hooks approach](#hooks-approach)
  * [API Client approach](#api-client-approach)
  * [`extendedResponseFormat`](#extendedresponseformat)
  * [`LinkedId` and `tags`](#linkedid-and-tags)
* [API Reference](#api-reference)
* [Additional Resources](#additional-resources)
* [Support and feedback](#support-and-feedback)
* [License](#license)

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

### 2. Configure native dependencies

* **iOS**
  ```shell
  cd ios && pod install
  ```

* **Android**

  Add a declaration of the Fingerprint Android repository to your app main `build.gradle` file to the `allprojects` section:
  ```groovy
  maven {
    url("https://maven.fpregistry.io/releases")
  }
  maven {
    url("https://www.jitpack.io")
  }
  ```

  The file location is `{rootDir}/android/build.gradle`.
  After the changes the `build.gradle` file should look as following:

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
       url("https://maven.fpregistry.io/releases")
     }
     maven {
       url("https://www.jitpack.io")
     }
     google()
   }
  }
  ```

## Usage

To identify visitors, you need a Fingerprint Pro account (you can [sign up for free](https://dashboard.fingerprintjs.com/signup/)).

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
It can be requested using the `extendedResponseFormat`: true parameter. See more details about the responses in the [documentation](https://dev.fingerprint.com/docs/js-agent#extendedResult).

#### Providing `extendedResponseFormat` with hooks approach

```javascript
  return (
    <FingerprintJsProProvider apiKey={PUBLIC_API_KEY} extendedResponseFormat={true}>
      <App />
    </FingerprintJsProProvider>
  )
```

#### Providing `extendedResponseFormat` with API Client approach

```javascript
const FingerprintClient = new FingerprintJsProAgent({ apiKey: 'PUBLIC_API_KEY', region: 'eu', extendedResponseFormat: true }); // Region may be 'us', 'eu', or 'ap'
// =================================================================================================^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### `LinkedId` and `tags`

`linkedId` is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API
For more information, see [Linked ID](https://dev.fingerprint.com/docs/js-agent#linkedid).

`tag` is a customer-provided value or an object that will be saved together with the analysis event and will be returned back to you in a webhook message or when you search for the visit in the server API.
For more information, see [Tag](https://dev.fingerprint.com/docs/js-agent#tag).

#### Providing `linkedId` and `tags` with hooks approach

```javascript
const { getData } = useVisitorData();
const tags = {
  tag1: 'string tag',
  tag2: 42,
  tag3: true,
  tag4: [0, 1, 1, 2, 5],
  tag5: { foo: 'bar' }
};
const linkedId = 'custom id';

const visitorData = await getData(tags, linkedId);
```

#### Providing `linkedId` and `tags` with API Client approach

```javascript
const { getData } = useVisitorData();
const tags = {
  tag1: 'string tag',
  tag2: 42,
  tag3: true,
  tag4: [0, 1, 1, 2, 5],
  tag5: { foo: 'bar' }
};
const linkedId = 'custom id';

const visitorId = await FingerprintClient.getVisitorId(tags, linkedId); // Use this method if you need only visitorId
const visitorData = await FingerprintClient.getVisitorData(tags, linkedId); // Use this method if you need additional information about visitor
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

