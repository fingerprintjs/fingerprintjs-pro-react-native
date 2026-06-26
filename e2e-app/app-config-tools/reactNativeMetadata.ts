import { disableNewArch } from './arch'
import { setCompileSdkVersion, stripAndroidExtraBuildProperties } from './android'
import { withNewArchFlag, withSplashscreen } from './expoConfigPatchers'

// config is typed as any, as different expo version have different types for the config object
type ExpoConfigPatcher = (config: any) => void

type ReactNativeMetadata = {
  callbacks: (() => void)[]
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
 */
const reactNativeMetadata: Record<string, ReactNativeMetadata> = {
  0.74: {
    callbacks: [disableNewArch, stripAndroidExtraBuildProperties, setCompileSdkVersion(34)],
    patchExpoConfig: [withNewArchFlag, withSplashscreen],
  },
  0.75: {
    callbacks: [disableNewArch, stripAndroidExtraBuildProperties, setCompileSdkVersion(34)],
    patchExpoConfig: [withNewArchFlag, withSplashscreen],
  },
  0.76: {
    callbacks: [stripAndroidExtraBuildProperties, setCompileSdkVersion(35)],
    patchExpoConfig: [withNewArchFlag, withSplashscreen],
  },
  0.77: {
    callbacks: [stripAndroidExtraBuildProperties, setCompileSdkVersion(35)],
    patchExpoConfig: [withNewArchFlag, withSplashscreen],
  },
}

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
