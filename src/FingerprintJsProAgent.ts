import { NativeModules } from 'react-native'
import { UnknownError, unwrapError } from './errors'
import type { FingerprintJsProAgentParams, Tags, VisitorData, RequestOptions } from './types'
import * as packageInfo from '../package.json'

type VisitorId = string

export class FingerprintJsProAgent {
  private requestOptions: RequestOptions = {}

  constructor({
    apiKey,
    region,
    endpointUrl,
    fallbackEndpointUrls = [],
    extendedResponseFormat = false,
    requestOptions = {},
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
      this.requestOptions = requestOptions
    } catch (e) {
      console.error('RNFingerprintjsPro init error: ', e)
    }
  }

  public async getVisitorId(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorId> {
    try {
      const timeout = options?.timeout ?? this.requestOptions.timeout
      return await NativeModules.RNFingerprintjsPro.getVisitorId(tags, linkedId, timeout)
    } catch (error) {
      if (error instanceof Error) {
        throw unwrapError(error)
      } else {
        throw new UnknownError(String(error))
      }
    }
  }

  public async getVisitorData(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorData> {
    try {
      const timeout = options?.timeout ?? this.requestOptions.timeout
      const [requestId, confidenceScore, visitorDataJsonString, sealedResult] =
        await NativeModules.RNFingerprintjsPro.getVisitorData(tags, linkedId, timeout)
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
