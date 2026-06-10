import { execSync } from 'node:child_process'
import pkg from '../package.json' with { type: 'json' };

const devPackages = Object.keys(pkg.devDependencies)

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
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.74: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.75: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.76: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.78: {
    packages: ['expo@52', 'detox@20.28.0', '@config-plugins/detox@9'],
  },
  0.79: {
    packages: ['expo@52', 'detox@20.28.0', '@config-plugins/detox@9'],
  },
  '0.80': {
    packages: ['expo@53', 'detox@20.37.0', '@config-plugins/detox@11'],
  },
  0.81: {
    packages: ['expo@53', 'detox@20.37.0', '@config-plugins/detox@11'],
  },
}

const rnVersion = process.env.REACT_NATIVE_VERSION

if (!rnVersion) {
  throw new Error('RN version is not provided')
}

const metadata = getCompatibilityMetadata(rnVersion)

installPackages(`react-native@${rnVersion}`, ...metadata.packages)

function extractPackageName(dependency) {
  return dependency.replace(/@[0-9].*/, '')
}

function installPackages(...packages) {
  const devPackagesToInstall = packages.filter((pkg) => devPackages.includes(extractPackageName(pkg)))
  const nonDevPackagesToInstall = packages.filter((pkg) => !devPackages.includes(extractPackageName(pkg)))

  if (devPackagesToInstall.length) {
    installDevPackages(...devPackagesToInstall)
  }

  if (nonDevPackagesToInstall.length) {
    console.info('Installing non-dev packages', nonDevPackagesToInstall)
    execSync(`pnpm add ${nonDevPackagesToInstall.join(' ')}`, {
      stdio: 'inherit',
    })
  }
}

function installDevPackages(...packages) {
  console.info('Installing dev packages', packages)
  execSync(`pnpm add ${packages.join(' ')} -D`, {
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
