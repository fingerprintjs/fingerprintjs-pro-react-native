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
 * Optional arguments are modelled as nullable (`| null`) rather than optional (`?`) because
 * Codegen relies on positional arguments and some optional values are followed by required ones
 * (e.g. `timeout`). Nullability maps onto the native modules, which already treat absent
 * `tags`/`linkedId`/`region`/`endpointUrl` as "not provided".
 */
export interface Spec extends TurboModule {
  configure(
    apiToken: string,
    region: string | null,
    endpointUrl: string | null,
    fallbackEndpointUrls: string[],
    extendedResponseFormat: boolean,
    pluginVersion: string,
    allowUseOfLocationData: boolean,
    locationTimeoutMillis: Double
  ): void

  getVisitorId(tags: UnsafeObject | null, linkedId: string | null): Promise<string>

  getVisitorIdWithTimeout(tags: UnsafeObject | null, linkedId: string | null, timeout: Double): Promise<string>

  getVisitorData(tags: UnsafeObject | null, linkedId: string | null): Promise<NativeVisitorData>

  getVisitorDataWithTimeout(
    tags: UnsafeObject | null,
    linkedId: string | null,
    timeout: Double
  ): Promise<NativeVisitorData>
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNFingerprintjsPro')
