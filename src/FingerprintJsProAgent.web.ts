import { UnknownError, unwrapError } from './errors'
import type { FingerprintJsProAgentParams, ProAgent, RequestOptions, Tags, VisitorData, VisitorId } from './types'
import { FingerprintJSPro, FpjsClient } from '@fingerprintjs/fingerprintjs-pro-spa'

/**
 *
 * @group API Client approach
 * @platform web
 */
export class FingerprintJsProAgent implements ProAgent {
  private readonly requestOptions: RequestOptions = {}

  private readonly extendedResponseFormat: boolean = false

  private readonly client: FpjsClient

  private readonly agentPromise: Promise<FingerprintJSPro.Agent>

  constructor({
    apiKey,
    region,
    endpointUrl,
    fallbackEndpointUrls = [],
    extendedResponseFormat = false,
    requestOptions = {},
    scriptUrlPattern,
    storageKey,
    urlHashing,
    remoteControlDetection,
    cache,
    cachePrefix,
    cacheLocation,
    cacheTimeInSeconds,
  }: FingerprintJsProAgentParams) {
    const endpoints: string[] = []
    if (endpointUrl) {
      endpoints.push(endpointUrl)
    }
    endpoints.push(...fallbackEndpointUrls)

    this.client = new FpjsClient({
      loadOptions: {
        apiKey,
        region,
        endpoint: endpoints.length > 0 ? endpoints : undefined,
        scriptUrlPattern,
        storageKey,
        urlHashing,
        remoteControlDetection,
      },
      cache,
      cachePrefix,
      cacheLocation,
      cacheTimeInSeconds,
    })
    this.agentPromise = this.client.init()
    this.requestOptions = requestOptions
    this.extendedResponseFormat = extendedResponseFormat
  }

  /**
   * @inheritDoc
   * */
  public async getVisitorId(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorId> {
    try {
      const timeout = options?.timeout ?? this.requestOptions.timeout

      const agent = await this.agentPromise
      const result = await agent.get({
        extendedResult: this.extendedResponseFormat,
        tag: tags,
        linkedId,
        timeout,
      })

      return result.visitorId
    } catch (error) {
      if (error instanceof Error) {
        throw unwrapError(error)
      } else {
        throw new UnknownError(String(error))
      }
    }
  }

  /**
   * @inheritDoc
   * */
  public async getVisitorData(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorData> {
    try {
      const timeout = options?.timeout ?? this.requestOptions.timeout
      const agent = await this.agentPromise

      return await agent.get({
        tag: tags,
        linkedId,
        extendedResult: this.extendedResponseFormat,
        timeout,
      })
    } catch (error) {
      if (error instanceof Error) {
        throw unwrapError(error)
      } else {
        throw new UnknownError(String(error))
      }
    }
  }
}
