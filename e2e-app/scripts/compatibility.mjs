import { execSync } from 'node:child_process'
import pkg from '../package.json' with { type: 'json' };

const devPackages = Object.keys(pkg.devDependencies)

const reactNativeMetadata = {
  0.74: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
  },
  0.75: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8', '@react-native-community/cli@14'],
  },
  0.76: {
    packages: ['expo@52', 'detox@20.28.0', '@config-plugins/detox@9', '@react-native-community/cli@15'],
  },
  0.77: {
    packages: ['expo@52', 'detox@20.28.0', '@config-plugins/detox@9', '@react-native-community/cli@16'],
  },
  0.78: {
    // https://expo.dev/changelog/react-native-78
    packages: ['expo@53.0.0-canary-20250306-d9d3e02', 'detox@20.37.0', '@config-plugins/detox@11', '@react-native-community/cli@18'],
  },
  0.79: {
    packages: ['expo@53', 'detox@20.37.0', '@config-plugins/detox@11', '@react-native-community/cli@18'],
  },
  '0.80': {
    packages: ['expo@54', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.81: {
    packages: ['expo@54', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.82: {
    // SDK 55 stable bundles RN 0.83; this is the last SDK 55 canary that pinned RN 0.82 (0.82.1).
    packages: ['expo@55.0.0-canary-20251223-b83b31e', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.83: {
    packages: ['expo@55', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.84: {
    // SDK 56 stable bundles RN 0.85; this is the last SDK 56 canary that pinned RN 0.84 (0.84.1).
    packages: ['expo@56.0.0-canary-20260305-5163746', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
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
