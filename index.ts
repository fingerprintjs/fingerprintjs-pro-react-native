import React from 'react';
import {NativeModules} from 'react-native';

const { RNFingerprintjsPro } = NativeModules;

class FingerprintjsPro extends React.Component {
  static init(apiKey: string) {
    try {
      RNFingerprintjsPro.init(apiKey)
    } catch (e) {
      console.error(e)
    }
  }

  static getVisitorId() {
    try {
      return RNFingerprintjsPro.getVisitorId()
    } catch (e) {
      console.error(e)
    }
  }
}

export default FingerprintjsPro;
