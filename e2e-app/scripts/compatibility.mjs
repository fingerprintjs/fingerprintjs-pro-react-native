import { execSync } from 'node:child_process'
import pkg from '../package.json' with { type: 'json' }

const devPackages = Object.keys(pkg.devDependencies)

const reactNativeMetadata = {
  0.79: {
    packages: ['expo@53', 'detox@20.37.0', '@config-plugins/detox@11', 'react@19.0.0', 'react-dom@19.0.0'],
  },
  0.81: {
    packages: ['expo@54', 'detox@20.51.0', '@config-plugins/detox@11', 'react@19.1.0', 'react-dom@19.1.0'],
  },
  0.83: {
    // @expo/dom-webview is an optional peer of expo, absent from bundledNativeModules (so
    // `expo install --fix` never realigns it) and published only for SDK 55+. Pin it to the SDK 55
    // line; otherwise the base's SDK 56 build (56.0.x) is kept and its native module references
    // expo-modules-core classes (e.g. AnyTypeCache, added in core 56) that SDK 55 lacks, crashing
    // at module registration.
    packages: [
      'expo@55',
      'detox@20.51.0',
      '@config-plugins/detox@11',
      'react@19.2.0',
      'react-dom@19.2.0',
      '@expo/dom-webview@55',
    ],
  },
  0.85: {
    packages: ['expo@56', 'detox@20.51.0', '@config-plugins/detox@11', 'react@19.2.0', 'react-dom@19.2.0'],
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
