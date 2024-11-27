import { NativeModules } from 'react-native'
import { UnknownError, unwrapError } from './errors'
import type { FingerprintJsProAgentParams, Tags, VisitorData } from './types'
import * as packageInfo from '../package.json'

type VisitorId = string

/**
 *
 * @group API Client approach
 */
export class FingerprintJsProAgent {
  /**
   * Initialises FingerprintJS Pro Agent with certain settings
   *
   * @param params
   */
  constructor({
    apiKey,
    region,
    endpointUrl,
    fallbackEndpointUrls = [],
    extendedResponseFormat = false,
  }: FingerprintJsProAgentParams) {
    try {
      NativeModules.RNFingerprintjsPro.init(
        apiKey,
        region,
        endpointUrl,
        fallbackEndpointUrls,
        extendedResponseFormat,
        packageInfo.version
      )
    } catch (e) {
      console.error('RNFingerprintjsPro init error: ', e)
    }
  }

  /**
   * Returns visitor identifier based on the request options {@link https://dev.fingerprint.com/docs/native-android-integration#get-the-visitor-identifier | more info in the documentation page}
   *
   * @param tags is a customer-provided value or an object that will be saved together with the analysis event and will be returned back to you in a webhook message or when you search for the visit in the server API. {@link https://dev.fingerprint.com/docs/js-agent#tag | more info in the documentation page}
   * @param linkedId  is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API {@link https://dev.fingerprint.com/docs/js-agent#linkedid | more info in the documentation page}
   */
  public async getVisitorId(tags?: Tags, linkedId?: string): Promise<VisitorId> {
    try {
      return await NativeModules.RNFingerprintjsPro.getVisitorId(tags, linkedId)
    } catch (error) {
      if (error instanceof Error) {
        throw unwrapError(error)
      } else {
        throw new UnknownError(String(error))
      }
    }
  }

  /**
   * Returns visitor identification data based on the request options {@link https://dev.fingerprint.com/docs/native-android-integration#get-the-visitor-identifier | more info in the documentation page}
   *
   * Provide `extendedResponseFormat` option in the {@link constructor} to get response in the {@link https://dev.fingerprint.com/docs/native-android-integration#response-format | extended format}
   *
   * @param tags is a customer-provided value or an object that will be saved together with the analysis event and will be returned back to you in a webhook message or when you search for the visit in the server API. {@link https://dev.fingerprint.com/docs/js-agent#tag | more info in the documentation page}
   * @param linkedId  is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API {@link https://dev.fingerprint.com/docs/js-agent#linkedid | more info in the documentation page}
   */
  public async getVisitorData(tags?: Tags, linkedId?: string): Promise<VisitorData> {
    try {
      const [requestId, confidenceScore, visitorDataJsonString, sealedResult] =
        await NativeModules.RNFingerprintjsPro.getVisitorData(tags, linkedId)
      const result = {
        ...JSON.parse(visitorDataJsonString),
        requestId,
        confidence: {
          score: confidenceScore,
        },
      }

      if (sealedResult) {
        result['sealedResult'] = sealedResult
      }

      return result
    } catch (error) {
      if (error instanceof Error) {
        throw unwrapError(error)
      } else {
        throw new UnknownError(String(error))
      }
    }
  }
}
