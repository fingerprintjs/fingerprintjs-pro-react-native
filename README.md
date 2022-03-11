
# fingerprintjs-pro-react-native
Official React Native client for FingerprintJS PRO. Best identification solution for React Native.

# @fingerprintjs/fingerprintjs-pro-react-native

<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-react-native/blob/main/res/logo.svg?raw=true" alt="FingerprintJS" width="312px" />
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-react">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-react.svg?style=flat"/>
  </a>
   <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/:license-mit-blue.svg?style=flat"/>
  </a>
</p>


## Quick start

#### 1. Add `@fingerprintjs/fingerprintjs-pro-react-native` to your application via npm or yarn:


`npm install @fingerprintjs/fingerprintjs-pro-react-native --save`

or

`yarn add @fingerprintjs/fingerprintjs-pro-react-native`

Make sure you have updated iOS dependencies:

`cd ios && pod install`


## Usage
```javascript
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro-react-native';

... 

useEffect(() => {
  async function getVisitorId() {
    try {
      FingerprintJS.init('YOUR_BROWSER_API_TOKEN', 'YOUR_REGION'); // Region may be 'us' or 'eu'
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

