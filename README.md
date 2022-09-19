<p align="center">
  <a href="https://fingerprint.com">
    <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-react-native/HEAD/res/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-react-native/HEAD/res/logo_dark.svg" />
     <img src="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-react-native/HEAD/res/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-react-native">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-react-native.svg?style=flat"/>
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
</p>

# FingerprintJS PRO React Native

### Official React Native module for 100% accurate device identification, created for FingerprintJS Pro.

This module can be used in a React Native application to call the native FingerprintJS Pro libraries and identify devices.

FingerprintJS Pro is a professional visitor identification service that processes all information server-side and transmits it securely to your servers using server-to-server APIs.

Retrieve an accurate, sticky and stable [FingerprintJS Pro](https://fingerprint.com/) visitor identifier in an Android or an iOS app. This library communicates with the FingerprintJS Pro API and requires an [api key](https://dev.fingerprint.com/docs). 

Native libraries used under the hood:
- [FingerprintJS Pro iOS](https://github.com/fingerprintjs/fingerprintjs-pro-ios)
- [FingerprintJS Pro Android](https://github.com/fingerprintjs/fingerprintjs-pro-android)

## Quick start

#### 1. Add `@fingerprintjs/fingerprintjs-pro-react-native` to your application via npm or yarn:


`npm install @fingerprintjs/fingerprintjs-pro-react-native --save`

or

`yarn add @fingerprintjs/fingerprintjs-pro-react-native`

#### 2. Configure native dependencies

**iOS**

`cd ios && pod install`

**Android**

Add a declaration of the Fingerprint Android repository to your app main `build.gradle` file to the `allprojects` section: 

```groovy
maven {
  url("https://maven.fpregistry.io/releases")
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
        google()
    }
}
```

## Usage

### FingerprintJS public API key
To identify visitors, you need a FingerprintJS Pro account (you can [sign up for free](https://dashboard.fingerprintjs.com/signup/)).

- Go to [the Fingerprint Pro dashboard](https://dashboard.fingerprint.com/)
- Open the API keys page from the sidebar
- Find your Public API key

### Hooks approach

Configure the SDK by wrapping your application in FingerprintJsProProvider.

```javascript
// src/index.js
import React from 'react';
import { AppRegistry } from 'react-native';
import { FingerprintJsProProvider } from '@fingerprintjs/fingerprintjs-pro-react-native';
import App from './App';

AppRegistry.registerComponent(
  'AppName',
  <FingerprintJsProProvider
      apiKey: 'your-fpjs-public-api-key'
  >
    <App />
  </FingerprintJsProProvider>
);
```

Use the `useVisitorData` hook in your components to perform visitor identification and get the data.

```javascript
// src/App.js
import React, { useEffect } from 'react';
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
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>An error occured: {error.message}</div>;
  }

  if (data) {
    // perform some logic based on the visitor data
    return (
      <div>
        Visitor id is {data.visitorId}
      </div>
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

useEffect(async () => {
  async function getVisitorInfo() {
    try {
      const FingerprintJSClient = new FingerprintJsProAgent('PUBLIC_API_KEY', 'REGION'); // Region may be 'us', 'eu', or 'ap'
      const visitorId = await FingerprintJSClient.getVisitorId(); // Use this method if you need only visitorId
      const visitorData = await FingerprintJSClient.getVisitorData(); // Use this method if you need additional information about visitor
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
const FingerprintJSClient = new FingerprintJsProAgent('PUBLIC_API_KEY', 'REGION', null, true); // Region may be 'us', 'eu', or 'ap'
// =====================================================================================^^^^^
```

### `LinkedId` and `tags`

`linkedId` is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API
More information about approaches you can find in the [js agent documentation](https://dev.fingerprint.com/docs/js-agent#linkedid).

`tag` is a customer-provided value or an object that will be saved together with the analysis event and will be returned back to you in a webhook message or when you search for the visit in the server API.
More information about approaches you can find in the [js agent documentation](https://dev.fingerprint.com/docs/js-agent#tag).

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

const visitorId = await FingerprintJSClient.getVisitorId(tags, linkedId); // Use this method if you need only visitorId
const visitorData = await FingerprintJSClient.getVisitorData(tags, linkedId); // Use this method if you need additional information about visitor
```

## API Reference
You can find API reference [here](https://fingerprintjs.github.io/fingerprintjs-pro-react-native/).

## Additional Resources
- [Server-to-Server API](https://dev.fingerprint.com/docs/server-api)
- [Fingerprint Pro documentation](https://dev.fingerprint.com/docs)

## Limitations
- Fingerprint Pro [request filtering](https://dev.fingerprint.com/docs/request-filtering) is not supported right now. Allowed and forbidden origins cannot be used.
- Using inside Expo [environment](https://docs.expo.dev) is not supported right now.

## License
This library is MIT licensed.

