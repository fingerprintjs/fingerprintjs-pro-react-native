import { disableNewArch } from './arch'
import { stripAndroidExtraBuildProperties } from './android'

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
const reactNativeMetadata: Record<string, { callbacks: (() => void)[] }> = {
  0.73: {
    callbacks: [disableNewArch, stripAndroidExtraBuildProperties],
  },
  0.74: {
    callbacks: [disableNewArch, stripAndroidExtraBuildProperties],
  },
  0.75: {
    callbacks: [disableNewArch, stripAndroidExtraBuildProperties],
  },
  0.76: {
    callbacks: [stripAndroidExtraBuildProperties],
  },
}

export function handleReactNativeVersion(rnVersion: string) {
  if (reactNativeMetadata[rnVersion]?.callbacks?.length) {
    reactNativeMetadata[rnVersion].callbacks.forEach((callback) => callback())
  }
}
