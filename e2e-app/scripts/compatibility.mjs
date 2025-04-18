import { execSync } from 'node:child_process'

/**
 * An object representing metadata for different versions of React Native.
 *
 * Each key in the object represents a specific React Native version, and its
 * associated value contains information about the packages applicable for that version.
 *
 * Structure:
 * - `packages`: An array of strings specifying the version-specific package dependencies.
 *
 */
const reactNativeMetadata = {
  0.73: {
    packages: ['expo@50', 'detox@20.17.0', '@config-plugins/detox@7'],
  },
  0.74: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.75: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.76: {
    packages: ['expo@51', 'detox@20'],
  },
}

const rnVersion = process.env.REACT_NATIVE_VERSION

if (!rnVersion) {
  throw new Error('RN version is not provided')
}

const metadata = getCompatibilityMetadata(rnVersion)

installPackages(`react-native@${rnVersion}`, ...metadata.packages)

function installPackages(...packages) {
  execSync(`yarn add ${packages.join(' ')} -D`, {
    stdio: 'inherit',
  })
}

function getCompatibilityMetadata(rnVersion) {
  const metadata = reactNativeMetadata[rnVersion]

  if (!metadata) {
    throw new Error(`No metadata found for react-native@${rnVersion}`)
  }

  return metadata
}
