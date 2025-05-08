// Required in order to import other .ts files - https://docs.expo.dev/guides/typescript/#appconfigjs
import 'ts-node/register'
import { ExpoConfig } from '@expo/config'
import { dependencies } from './package.json'
import * as semver from 'semver'
import { handleReactNativeVersion } from './app-config-tools/reactNativeMetadata'
import { getAndroidBuildProperties } from './app-config-tools/android'
import { getNewArch } from './app-config-tools/arch'

let rawReactNativeVersion = dependencies['react-native']

// Ensure that react-native version contains patch range so that semver can parse it
if (rawReactNativeVersion.split('.').length === 2) {
  rawReactNativeVersion = rawReactNativeVersion + '.0'
}

const rnVersion = semver.parse(rawReactNativeVersion)
if (!rnVersion) {
  throw new Error(`Could not parse react-native version: ${dependencies['react-native']}`)
}

const rnVersionStr = rnVersion.major + '.' + rnVersion.minor
handleReactNativeVersion(rnVersionStr)

const config: ExpoConfig = {
  name: 'E2EApp',
  slug: 'e2eapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'e2eapp',
  newArchEnabled: getNewArch(),
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
        android: getAndroidBuildProperties(),
      },
    ],
    '@config-plugins/detox',
    './plugins/withGradleProperties.js',
  ],
}

export default config
