import { NativeModules } from 'react-native'
import { Region, Tags } from './types'

type VisitorId = string

export class FingerprintJsProAgent {
  /**
   * Initialises FingerprintJS Pro Agent with certain settings
   *
   * @param apiKey your public API key that authenticates the agent with the API
   * @param region which region to use
   * @param endpointUrl server API URL, should be only used with Subdomain integration
   */
  constructor(apiKey: string, region?: Region, endpointUrl?: string) {
    try {
      NativeModules.RNFingerprintjsPro.init(apiKey, region, endpointUrl)
    } catch (e) {
      console.error('RNFingerprintjsPro init error: ', e)
    }
  }

  /**
   * Returns visitor identifier based on the request options
   * [https://dev.fingerprintjs.com/docs/native-android-integration#get-the-visitor-identifier]
   */
  public getVisitorId(tags?: Tags): Promise<VisitorId> {
    try {
      return NativeModules.RNFingerprintjsPro.getVisitorId(tags)
    } catch (e) {
      console.error('RNFingerprintjsPro getVisitorId error: ', e)
      throw new Error('RNFingerprintjsPro getVisitorId error: ' + e)
    }
  }
}
