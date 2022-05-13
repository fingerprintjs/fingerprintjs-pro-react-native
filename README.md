<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-react-native/HEAD/res/logo.svg" alt="FingerprintJS" width="312px" />
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

### Official React Native module for 100% accurate device identification, created for the FingerprintJS Pro Server API.

This module can be used in a React Native application to call the native FingerprintJS Pro libraries and identify devices.

FingerprintJS Pro is a professional visitor identification service that processes all information server-side and transmits it securely to your servers using server-to-server APIs.

Retrieve an accurate, sticky and stable [FingerprintJS Pro](https://fingerprintjs.com/) visitor identifier in an Android or an iOS app. This library communicates with the FingerprintJS Pro API and requires an [api key](https://dev.fingerprintjs.com/docs). 

Native libraries used under the hood:
- [FingerprintJS Pro iOS](https://github.com/fingerprintjs/fingerprintjs-pro-ios)
- [FingerprintJS Pro Android](https://github.com/fingerprintjs/fingerprintjs-pro-android)

## Quick start

#### 1. Add `@fingerprintjs/fingerprintjs-pro-react-native` to your application via npm or yarn:


`npm install @fingerprintjs/fingerprintjs-pro-react-native --save`

or

`yarn add @fingerprintjs/fingerprintjs-pro-react-native`

Make sure you have updated iOS dependencies:

`cd ios && pod install`


## Usage

### FingerprintJS public API key
To identify visitors, you need a FingerprintJS Pro account (you can [sign up for free](https://dashboard.fingerprintjs.com/signup/)).

- Go to [the FingerprintJS Pro dashboard](https://dashboard.fingerprintjs.com/)
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

... 

useEffect(() => {
  async function getVisitorId() {
    try {
      const FingerprintJSClient = new FingerprintJsProAgent('PUBLIC_API_KEY', 'REGION'); // Region may be 'us', 'eu', or 'ap'
      const visitorId = await FingerprintJSClient.getVisitorId();
    } catch (e) {
      console.error('Error: ', e);
    }
  }
  getVisitorId();
}, []);
```

## Additional Resources
- [Server-to-Server API](https://dev.fingerprintjs.com/docs/server-api)
- [FingerprintJS Pro documentation](https://dev.fingerprintjs.com/docs)

## Limitations
- FingerprintJS Pro [request filtering](https://dev.fingerprintjs.com/docs/request-filtering) is not supported right now. Allowed and forbidden origins cannot be used.
- Using inside Expo [environment](https://docs.expo.dev) is not supported right now.

## License
This library is MIT licensed.

