import { execSync } from 'node:child_process'
import pkg from '../package.json' with { type: 'json' };

const devPackages = Object.keys(pkg.devDependencies)

/**
 * An object representing metadata for different versions of React Native.
 *
 * Each key in the object represents a specific React Native version, and its
 * associated value contains information about the packages applicable for that version.
 *
 * The matrix `react-native` version is always installed as-is; the goal is to exercise the SDK
 * against every listed RN version. The packages below only provide the *scaffolding* (Expo SDK +
 * Detox config plugin) and supporting build tooling around that RN.
 *
 * `packages`: version-specific dependencies installed alongside `react-native@<matrix version>`.
 *
 * Two things have to be right per RN version, or the Android build fails:
 *
 * The SDK supports Expo >= 51 (see its peerDependencies), so the matrix floor is RN 0.74 (Expo
 * 51's RN). RN 0.73 is only supported in bare React Native and cannot be built through this
 * Expo-prebuild harness: Expo 51's template applies `com.facebook.react.settings` (added in RN
 * 0.74), which RN 0.73 doesn't ship, and no Expo >= 51 bundles RN 0.73.
 *
 * 1. Expo SDK / Detox plugin. `expo prebuild` scaffolds the native project from the Expo SDK's
 *    template. Pick the SDK whose own RN is the nearest one <= the matrix RN, so the generated
 *    settings.gradle never references a Gradle plugin the installed RN lacks:
 *      SDK 51 = RN 0.74 = @config-plugins/detox@8
 *      SDK 52 = RN 0.76 = @config-plugins/detox@9
 *      SDK 53 = RN 0.79 = @config-plugins/detox@11
 *      SDK 54 = RN 0.81 = @config-plugins/detox@11
 *      SDK 55 = RN 0.83 = @config-plugins/detox@11
 *      SDK 56 = RN 0.85 = @config-plugins/detox@11
 *    @config-plugins/detox@11 is the latest published major; despite declaring `expo: ^53` as its
 *    peer it works through at least SDK 56 (the `local` target pairs it with SDK 56), so it is the
 *    plugin used for every SDK >= 53.
 *
 * 2. @react-native-community/cli. RN >= 0.75 calls `autolinkLibrariesFromCommand` (i.e.
 *    `npx @react-native-community/cli config`) during Gradle settings evaluation. The CLI is only
 *    a transitive dep of RN 0.75 (and not a dep at all from 0.76+), and pnpm does not link
 *    transitive bins, so npx can't find it -> "exited with error code: 127". Installing it as a
 *    direct dep fixes it. The major is aligned to each RN's release (peer constraint is just `*`).
 *    RN <= 0.74 used file-based autolinking and needs no CLI.
 */
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
    packages: ['expo@52', 'detox@20.28.0', '@config-plugins/detox@9', '@react-native-community/cli@16'],
  },
  0.79: {
    packages: ['expo@53', 'detox@20.37.0', '@config-plugins/detox@11', '@react-native-community/cli@18'],
  },
  '0.80': {
    packages: ['expo@53', 'detox@20.37.0', '@config-plugins/detox@11', '@react-native-community/cli@19'],
  },
  0.81: {
    packages: ['expo@54', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.82: {
    packages: ['expo@54', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.83: {
    packages: ['expo@55', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
  },
  0.84: {
    packages: ['expo@55', 'detox@20.42.0', '@config-plugins/detox@11', '@react-native-community/cli@20'],
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
