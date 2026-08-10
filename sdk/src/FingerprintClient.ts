import { Platform } from 'react-native'
import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes'
import RNFingerprintjsPro, { type NativeVisitorData } from './specs/NativeRNFingerprintjsPro'
import type { FingerprintClient, FingerprintResponse, GetOptions, StartOptions, TagValue } from './types'
import { unwrapError } from './unwrapError'
import { isDefined, isTruthy } from './utils'

const packageVersion = '__VERSION__'

const DEFAULT_LOCATION_TIMEOUT_MILLIS = 5000

/**
 * Splits the {@link StartOptions.endpoints} value into a primary endpoint plus fallbacks, matching
 * the positional native `configure` contract.
 */
function normalizeEndpoints(endpoints: StartOptions['endpoints']): { endpointUrl: string | null; fallbacks: string[] } {
  if (!isDefined(endpoints)) {
    return { endpointUrl: null, fallbacks: [] }
  }
  const list = Array.isArray(endpoints) ? endpoints : [endpoints]
  const [primary, ...fallbacks] = list
  return { endpointUrl: list.length > 0 ? primary : null, fallbacks }
}

/**
 * The native SDKs model tags as a string→value map. Objects pass through unchanged; primitives and
 * arrays are wrapped under a `tag` key so both iOS and Android receive a valid object.
 */
function toNativeTag(tag: TagValue | undefined): UnsafeObject | null {
  if (!isDefined(tag)) {
    return null
  }
  if (typeof tag === 'object' && !Array.isArray(tag)) {
    return tag
  }
  return { tag }
}

function normalizeResponse(data: NativeVisitorData): FingerprintResponse {
  return {
    visitor_id: data.visitorId,
    event_id: data.eventId,
    suspect_score: data.suspectScore >= 0 ? data.suspectScore : undefined,
    sealed_result: isTruthy(data.sealedResult) ? data.sealedResult : null,
  }
}

class NativeFingerprintClient implements FingerprintClient {
  constructor(options: StartOptions) {
    const { apiKey, region, endpoints, android, ios } = options
    const { endpointUrl, fallbacks } = normalizeEndpoints(endpoints)

    const allowUseOfLocationData =
      (Platform.OS === 'ios' ? ios?.allowUseOfLocationData : android?.allowUseOfLocationData) ?? false
    const locationTimeoutMillis = android?.locationTimeoutMillis ?? DEFAULT_LOCATION_TIMEOUT_MILLIS

    RNFingerprintjsPro.configure(
      apiKey,
      packageVersion,
      fallbacks,
      allowUseOfLocationData,
      locationTimeoutMillis,
      region ?? null,
      endpointUrl
    )
  }

  public async get(options?: GetOptions): Promise<FingerprintResponse> {
    try {
      const data = await RNFingerprintjsPro.getVisitorData(
        toNativeTag(options?.tag),
        options?.linkedId ?? null,
        options?.timeout ?? null
      )
      return normalizeResponse(data)
    } catch (error) {
      throw unwrapError(error)
    }
  }
}

/**
 * Creates a Fingerprint client with the given options.
 *
 * @group API Client approach
 *
 * @example
 * ```ts
 * const fp = start({ apiKey: 'PUBLIC_API_KEY', region: 'eu' })
 * const result = await fp.get({ linkedId: 'user_1234' })
 * ```
 */
export function start(options: StartOptions): FingerprintClient {
  return new NativeFingerprintClient(options)
}
