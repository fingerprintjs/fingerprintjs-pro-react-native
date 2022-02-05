
# fingerprintjs-pro-react-native
Official React Native client for FingerprintJS PRO. Best identification solution for React Native.


## Getting started

`npm install react-native-fingerprintjs-pro --save`

or

`yarn add react-native-fingerprintjs-pro`

iOS:

`cd ios && pod install`


## Usage
```javascript
import RNFpjsPro from 'react-native-fingerprintjs-pro';
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

