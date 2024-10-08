const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // resetCache: true, // uncomment if you have problems with .env cache
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
