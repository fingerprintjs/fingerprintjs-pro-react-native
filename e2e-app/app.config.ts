import { ExpoConfig } from '@expo/config'
import { dependencies } from './package.json'
import { ExtraIosPodDependency } from 'expo-build-properties/build/pluginConfig'
import * as semver from 'semver'

let rawReactNativeVersion = dependencies['react-native']

// Ensure that react-native version contains patch range so that semver can parse it
if (rawReactNativeVersion.split('.').length === 2) {
  rawReactNativeVersion = rawReactNativeVersion + '.0'
}

const rnVersion = semver.parse(rawReactNativeVersion)
if (!rnVersion) {
  throw new Error(`Could not parse react-native version: ${dependencies['react-native']}`)
}

let newArch = false
const disableNewArch = () => {
  newArch = false
}

const androidBuildProperties = {
  minSdkVersion: 24,
  compileSdkVersion: 35,
  targetSdkVersion: 35,
  buildToolsVersion: '34.0.0',
  extraMavenRepos: ['https://maven.fpregistry.io/releases'],
} as Record<string, any>
const stripExtraBuildProperties = () => {
  delete androidBuildProperties.compileSdkVersion
  delete androidBuildProperties.targetSdkVersion
  delete androidBuildProperties.buildToolsVersion
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
const reactNativeMetadata: Record<string, { callbacks: (() => void)[] }> = {
  0.73: {
    callbacks: [disableNewArch, stripExtraBuildProperties],
  },
  0.74: {
    callbacks: [disableNewArch, stripExtraBuildProperties],
  },
  0.75: {
    callbacks: [disableNewArch, stripExtraBuildProperties],
  },
  0.76: {
    callbacks: [stripExtraBuildProperties],
  },
}
const metadataKey = rnVersion.major + '.' + rnVersion.minor
if (reactNativeMetadata[metadataKey]?.callbacks?.length) {
  reactNativeMetadata[metadataKey].callbacks.forEach((callback) => callback())
}

function createExtraPods() {
  const extraPods = [] as ExtraIosPodDependency[]
  const sdkVersion = dependencies['@fingerprintjs/fingerprintjs-pro-react-native']
  const usesLocalPackage = sdkVersion === '../'
  if (usesLocalPackage) {
    extraPods.push({
      name: 'RNFingerprintjsPro',
      path: '../node_modules/@fingerprintjs/fingerprintjs-pro-react-native',
    })
  }

  return extraPods
}

const config: ExpoConfig = {
  name: 'E2EApp',
  slug: 'e2eapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'e2eapp',
  newArchEnabled: newArch,
  splash: {
    backgroundColor: '#ffffff',
  },
  ios: {
    bundleIdentifier: 'com.fingerprint.e2eapp',
  },
  android: {
    package: 'com.fingerprint.e2eapp',
  },
  plugins: [
    [
      'expo-build-properties',
      {
        ios: {
          extraPods: createExtraPods(),
        },
        android: androidBuildProperties,
      },
    ],
    '@config-plugins/detox',
    './plugins/withGradleProperties.js',
  ],
}

export default config
