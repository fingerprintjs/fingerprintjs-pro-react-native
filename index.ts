import React from 'react';
import {NativeModules} from 'react-native';

const { RNFingerprintjsPro } = NativeModules;

class FingerprintjsPro extends React.Component {
  static init(apiKey: string, region?: 'eu' | 'us', endpointUrl?: string) {
    try {
      RNFingerprintjsPro.init(apiKey, region, endpointUrl)
    } catch (e) {
      console.error("RNFingerprintjsPro init error: ", e)
    }
  }

  static getVisitorId() {
    try {
      return RNFingerprintjsPro.getVisitorId()
    } catch (e) {
      console.error("RNFingerprintjsPro getVisitorId error: ", e)
    }
  }
}

export default FingerprintjsPro;
