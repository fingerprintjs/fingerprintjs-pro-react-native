import { UnknownError } from './errors'
import RNFingerprintjsPro, { type NativeVisitorData } from './specs/NativeRNFingerprintjsPro'
import type { FingerprintJsProAgentParams, ProAgent, RequestOptions, Tags, VisitorData, VisitorId } from './types'
import { unwrapError } from './unwrapError'
import { isDefined, isTruthy } from './utils'

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
      RNFingerprintjsPro.configure(
        apiKey,
        region ?? null,
        endpointUrl ?? null,
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
      if (isDefined(timeout)) {
        return await RNFingerprintjsPro.getVisitorIdWithTimeout(tags ?? null, linkedId ?? null, timeout)
      }

      return await RNFingerprintjsPro.getVisitorId(tags ?? null, linkedId ?? null)
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
      let visitorData: NativeVisitorData
      if (isDefined(timeout)) {
        visitorData = await RNFingerprintjsPro.getVisitorDataWithTimeout(tags ?? null, linkedId ?? null, timeout)
      } else {
        visitorData = await RNFingerprintjsPro.getVisitorData(tags ?? null, linkedId ?? null)
      }
      const { requestId, confidenceScore, visitorDataJson, sealedResult } = visitorData
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const result = {
        ...JSON.parse(visitorDataJson),
        requestId,
        confidence: {
          score: confidenceScore,
        },
      } as VisitorData

      if (isTruthy(sealedResult)) {
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
