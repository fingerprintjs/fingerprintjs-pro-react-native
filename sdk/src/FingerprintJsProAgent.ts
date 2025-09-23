import { NativeModules } from 'react-native'
import { UnknownError } from './errors'
import type { FingerprintJsProAgentParams, ProAgent, RequestOptions, Tags, VisitorData, VisitorId } from './types'
import { unwrapError } from './unwrapError'

const packageVersion = '__VERSION__'

/**
 *
 * @group API Client approach
 */
export class FingerprintJsProAgent implements ProAgent {
  /**
   * Initialises FingerprintJS Pro Agent with certain settings
   *
   * @param params
   */
  private requestOptions: RequestOptions = {}

  constructor({
    apiKey,
    region,
    endpointUrl,
    fallbackEndpointUrls = [],
    extendedResponseFormat = false,
    requestOptions = {},
    allowUseOfLocationData = false,
    locationTimeoutMillisAndroid = 5000,
  }: FingerprintJsProAgentParams) {
    try {
      NativeModules.RNFingerprintjsPro.configure(
        apiKey,
        region,
        endpointUrl,
        fallbackEndpointUrls,
        extendedResponseFormat,
        packageVersion,
        allowUseOfLocationData,
        locationTimeoutMillisAndroid
      )
      this.requestOptions = requestOptions
    } catch (e) {
      console.error('RNFingerprintjsPro configure error: ', e)
    }
  }

  /**
   * Returns visitor identifier based on the request options {@link https://dev.fingerprint.com/docs/native-android-integration#get-the-visitor-identifier | more info in the documentation page}
   *
   * @param tags is a customer-provided value or an object that will be saved together with the analysis event and will be returned back to you in a webhook message or when you search for the visit in the server API. {@link https://dev.fingerprint.com/docs/js-agent#tag | more info in the documentation page}
   * @param linkedId is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API {@link https://dev.fingerprint.com/docs/js-agent#linkedid | more info in the documentation page}
   * @param options is used to configure requests with different settings
   */
  public async getVisitorId(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorId> {
    try {
      const timeout = options?.timeout ?? this.requestOptions.timeout
      if (timeout != null) {
        return await NativeModules.RNFingerprintjsPro.getVisitorIdWithTimeout(tags, linkedId, timeout)
      }

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
   * @param linkedId is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API {@link https://dev.fingerprint.com/docs/js-agent#linkedid | more info in the documentation page}
   * @param options is used to configure requests with different settings
   */
  public async getVisitorData(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorData> {
    try {
      const timeout = options?.timeout ?? this.requestOptions.timeout
      let visitorData: unknown[] | null
      if (timeout != null) {
        visitorData = await NativeModules.RNFingerprintjsPro.getVisitorDataWithTimeout(tags, linkedId, timeout)
      } else {
        visitorData = await NativeModules.RNFingerprintjsPro.getVisitorData(tags, linkedId)
      }
      const [requestId, confidenceScore, visitorDataJsonString, sealedResult] = visitorData!
      const result = {
        ...JSON.parse(visitorDataJsonString as string),
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
