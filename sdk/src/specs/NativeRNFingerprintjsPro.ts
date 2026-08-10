import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import type { Double, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes'

/**
 * Raw visitor data returned by the native module.
 *
 * Codegen requires every field to be non-nullable and numbers to be typed as {@link Double}, so the
 * optional API v4 fields use sentinels the JS layer normalizes away:
 * - `suspectScore` is `-1` when the field is absent (Smart Signals disabled).
 * - `sealedResult` is an empty string when unavailable.
 */
export interface NativeVisitorData {
  visitorId: string
  eventId: string
  suspectScore: Double
  sealedResult: string
}

/**
 * Codegen TurboModule spec for the `RNFingerprintjsPro` native module.
 *
 * Optional string/object/number arguments are modelled as nullable (`| null`); Codegen relies on
 * positional arguments and native treats `null` as "not provided". Genuinely optional parameters
 * (those without an SDK-side default: `region`, `endpointUrl`, `timeout`) come last in each signature.
 */
export interface Spec extends TurboModule {
  configure(
    apiToken: string,
    pluginVersion: string,
    fallbackEndpointUrls: string[],
    allowUseOfLocationData: boolean,
    locationTimeoutMillis: Double,
    region: string | null,
    endpointUrl: string | null
  ): void

  getVisitorData(tag: UnsafeObject | null, linkedId: string | null, timeout: Double | null): Promise<NativeVisitorData>
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNFingerprintjsPro')
