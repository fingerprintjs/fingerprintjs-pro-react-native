import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import type { Double, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes'

/**
 * Raw visitor data returned by the native module. The visitor payload is delivered as a JSON
 * string (`visitorDataJson`) that the SDK parses and merges with the top-level fields.
 *
 * Codegen requires the numeric field to be typed as {@link Double} and every field to be
 * non-nullable, so `sealedResult` is an empty string (rather than absent) when unavailable.
 */
export interface NativeVisitorData {
  requestId: string
  confidenceScore: Double
  visitorDataJson: string
  sealedResult: string
}

/**
 * Codegen TurboModule spec for the `RNFingerprintjsPro` native module.
 *
 * Optional arguments are modelled as nullable (`| null`) — Codegen relies on positional arguments,
 * and nullability maps onto the native modules, which treat `null` as "not provided". Genuinely
 * optional parameters (those without an SDK-side default: `region`, `endpointUrl`, `timeout`) come
 * last in each signature.
 */
export interface Spec extends TurboModule {
  configure(
    apiToken: string,
    pluginVersion: string,
    extendedResponseFormat: boolean,
    fallbackEndpointUrls: string[],
    allowUseOfLocationData: boolean,
    locationTimeoutMillis: Double,
    region: string | null,
    endpointUrl: string | null
  ): void

  getVisitorId(tags: UnsafeObject | null, linkedId: string | null, timeout: Double | null): Promise<string>

  getVisitorData(tags: UnsafeObject | null, linkedId: string | null, timeout: Double | null): Promise<NativeVisitorData>
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNFingerprintjsPro')
