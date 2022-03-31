<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="res/logo.svg?raw=true" alt="FingerprintJS" width="312px" />
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-react">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-react.svg?style=flat"/>
  </a>
   <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/:license-mit-blue.svg?style=flat"/>
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
```javascript
import React, { useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro-react-native';

... 

useEffect(() => {
  async function getVisitorId() {
    try {
      FingerprintJS.init('PUBLIC_API_KEY', 'REGION'); // Region may be 'us', 'eu', or 'ap'
      const visitorId = await FingerprintJS.getVisitorId();
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

## License
This library is MIT licensed.

