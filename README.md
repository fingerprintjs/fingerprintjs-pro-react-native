
# fingerprintjs-pro-react-native
Official React Native client for FingerprintJS PRO. Best identification solution for React Native.


## Getting started

`npm install @fingerprintjs/fingerprintjs-pro-react-native --save`

or

`yarn add @fingerprintjs/fingerprintjs-pro-react-native`

iOS:

`cd ios && pod install`


## Usage
```javascript
import RNFpjsPro from '@fingerprintjs/fingerprintjs-pro-react-native';
...

useEffect(() => {
  async function getVisitorId() {
    try {
      RNFpjsPro.init('YOUR_BROWSER_API_TOKEN', 'YOUR_REGION');
      const visitorIdRaw = await RNFpjsPro.getVisitorId();
    } catch (e) {
      console.error('RN App error: ', e);
    }
  }
  getVisitorId();
}, []);
```

