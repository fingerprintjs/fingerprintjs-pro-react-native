import { ExtraIosPodDependency } from 'expo-build-properties/build/pluginConfig'
import { dependencies } from '../package.json'

export function createExtraPods() {
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
