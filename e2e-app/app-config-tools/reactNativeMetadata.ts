// config is typed as any, as different expo version have different types for the config object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpoConfigPatcher = (config: any) => void

type ReactNativeMetadata = {
  callbacks?: (() => void)[]
  patchExpoConfig?: ExpoConfigPatcher[]
}
/**
 * Holds metadata for specific versions of React Native, including callbacks
 * for version-specific adjustments or operations.
 *
 * @type {Record<string, { callbacks: (() => void)[] }>}
 *
 * - The key represents the version of React Native.
 * - The value is an object containing:
 *   - `callbacks`: An array of functions to execute in the context of the respective React Native version.
 *
 * The SDK supports React Native >= 0.79 (New Architecture only), so no version currently needs
 * version-specific handling. New entries can be added here if a future version requires it.
 */
const reactNativeMetadata: Record<string, ReactNativeMetadata | undefined> = {}

export function handleReactNativeVersion(rnVersion: string) {
  if (reactNativeMetadata[rnVersion]?.callbacks?.length) {
    reactNativeMetadata[rnVersion].callbacks.forEach((callback) => callback())
  }
}

/**
 * Updates the provided Expo configuration object by applying a series of patching functions
 * associated with the specified React Native version.
 */
export function patchExpoConfig<T>(rnVersion: string, config: T): T {
  const metadata = reactNativeMetadata[rnVersion]

  if (metadata?.patchExpoConfig?.length) {
    metadata.patchExpoConfig.forEach((patcher) => patcher(config))
  }

  return config
}
