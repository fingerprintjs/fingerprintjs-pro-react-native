import { NativeModules } from 'react-native'
import { Region, Tags, VisitorData } from './types'
import * as packageInfo from '../package.json'

type VisitorId = string

export class FingerprintJsProAgent {
  /**
   * Initialises FingerprintJS Pro Agent with certain settings
   *
   * @param apiKey your public API key that authenticates the agent with the API
   * @param region which region to use
   * @param endpointUrl server API URL, should be only used with Subdomain integration
   * @param extendedResponseFormat set this flag to get response in extended format
   */
  constructor(apiKey: string, region?: Region, endpointUrl?: string, extendedResponseFormat = false) {
    try {
      NativeModules.RNFingerprintjsPro.init(apiKey, region, endpointUrl, extendedResponseFormat, packageInfo.version)
    } catch (e) {
      console.error('RNFingerprintjsPro init error: ', e)
    }
  }

  /**
   * Returns visitor identifier based on the request options
   * [https://dev.fingerprint.com/docs/native-android-integration#get-the-visitor-identifier]
   */
  public getVisitorId(tags?: Tags, linkedId?: String): Promise<VisitorId> {
    try {
      return NativeModules.RNFingerprintjsPro.getVisitorId(tags, linkedId)
    } catch (e) {
      console.error('RNFingerprintjsPro getVisitorId error: ', e)
      throw new Error('RNFingerprintjsPro getVisitorId error: ' + e)
    }
  }

  /**
   * Returns visitor identification data based on the request options
   * Provide `extendedResponseFormat` option in constructor to get response in [extended format]{@link https://dev.fingerprint.com/docs/native-android-integration#response-format}
   * [https://dev.fingerprint.com/docs/native-android-integration#get-the-visitor-identifier]
   */
  public async getVisitorData(tags?: Tags, linkedId?: String): Promise<VisitorData> {
    try {
      const [requestId, confidenceScore, visitorDataJsonString] = await NativeModules.RNFingerprintjsPro.getVisitorData(
        tags,
        linkedId
      )
      return {
        ...JSON.parse(visitorDataJsonString),
        requestId,
        confidence: {
          score: confidenceScore,
        },
      }
    } catch (e) {
      console.error('RNFingerprintjsPro getVisitorData error: ', e)
      throw new Error('RNFingerprintjsPro getVisitorData error: ' + e)
    }
  }
}
