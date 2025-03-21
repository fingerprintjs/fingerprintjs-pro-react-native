import * as fs from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

const dirname = new URL('.', import.meta.url).pathname
const appJsonPath = path.resolve(dirname, '../app.json')

/**
 * An object representing metadata for different versions of React Native.
 *
 * Each key in the object represents a specific React Native version, and its
 * associated value contains information about the packages and callbacks
 * required or applicable for that version.
 *
 * Structure:
 * - `packages`: An array of strings specifying the version-specific package dependencies.
 * - `callbacks`: An array of callback functions associated with the version, if any.
 *
 */
const reactNativeMetadata = {
  0.73: {
    packages: ['expo@50', 'detox@20.17.0', '@config-plugins/detox@7'],
    callbacks: [disableNewArch, stripExtraBuildProperties],
  },
  0.74: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
    callbacks: [disableNewArch, stripExtraBuildProperties],
  },
  0.75: {
    packages: ['expo@51', 'detox@20.20.3', '@config-plugins/detox@8'],
    callbacks: [disableNewArch, stripExtraBuildProperties],
  },
  0.76: {
    packages: ['expo@51', 'detox@20'],
    callbacks: [stripExtraBuildProperties],
  },
}

const rnVersion = process.env.REACT_NATIVE_VERSION

if (!rnVersion) {
  throw new Error('RN version is not provided')
}

const metadata = getCompatibilityMetadata(rnVersion)

installPackages(`react-native@${rnVersion}`, ...metadata.packages)

if (metadata.callbacks?.length) {
  metadata.callbacks.map((cb) => cb())
}

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

function readAppJson() {
  return JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))
}

function updateAppJson(fn) {
  const appJson = readAppJson()
  fn(appJson)
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2))
}

/**
 * Disables the new architecture in the application's configuration by
 * modifying the configuration file and removing the `newArchEnabled` property.
 */
function disableNewArch() {
  console.info('Disabling new architecture')

  updateAppJson((config) => {
    delete config.expo.newArchEnabled
  })
}

/**
 * Removes extra build properties that are not compatible with older expo versions.
 * */
function stripExtraBuildProperties() {
  console.info('Stripping extra build properties')
  updateBuildProperties((config) => {
    delete config.android.compileSdkVersion
    delete config.android.targetSdkVersion
    delete config.android.buildToolsVersion
  })
}

function updateBuildProperties(callback) {
  const PLUGIN_NAME = 'expo-build-properties'

  updateAppJson((config) => {
    const plugin = config.expo.plugins.find(
      (plugin) => plugin === PLUGIN_NAME || (Array.isArray(plugin) && plugin[0] === PLUGIN_NAME)
    )
    if (!plugin) {
      return
    }

    if (Array.isArray(plugin)) {
      callback(plugin[1])
    }
  })
}
