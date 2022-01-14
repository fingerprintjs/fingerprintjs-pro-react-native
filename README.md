
# fingerprintjs-pro-react-native
Official React Native client for FingerprintJS PRO. Best identification solution for React Native.


## Getting started

`$ npm install react-native-fingerprintjs-pro --save`

### Mostly automatic installation

`$ react-native link react-native-fingerprintjs-pro`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-fingerprintjs-pro` and add `RNFingerprintjsPro.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNFingerprintjsPro.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.fingerprintjs.reactnative.RNFingerprintjsProPackage;` to the imports at the top of the file
  - Add `new RNFingerprintjsProPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-fingerprintjs-pro'
  	project(':react-native-fingerprintjs-pro').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-fingerprintjs-pro/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-fingerprintjs-pro')
  	```


## Usage
```javascript
import RNFingerprintjsPro from 'react-native-fingerprintjs-pro';

// TODO: What to do with the module?
RNFingerprintjsPro;
```
