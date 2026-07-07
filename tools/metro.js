const path = require('path')

const hoistedModules = ['react', 'react-native']

/**
 * Configures and returns the Metro bundler configuration for a project.
 *
 * It directly modifies the config rather than using `mergeConfig` because it causes issues in the E2E app with combinations of different React Native and Expo versions.
 *
 * @param {object} config - The initial Metro configuration object.
 * @param {string} projectRoot - The root directory of the project.
 * @return {object} The modified Metro configuration object with updated resolver and watcher settings.
 */
function getMetroConfig(config, projectRoot) {
  const sdkRoot = path.resolve(__dirname, '..', 'sdk')

  config.resolver.unstable_enableSymlinks = true
  config.resolver.unstable_enablePackageExports = true
  config.watchFolders = [...(config.watchFolders ?? []), sdkRoot]
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    ...(config.resolver.nodeModulesPaths ?? []),
  ]
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules ?? {}),
    ...Object.fromEntries(hoistedModules.map((name) => [name, path.resolve(projectRoot, 'node_modules', name)])),
  }
  config.resolver.blockList = [
    ...(Array.isArray(config.resolver.blockList)
      ? config.resolver.blockList
      : config.resolver.blockList
      ? [config.resolver.blockList]
      : []),
    ...hoistedModules.map(
      (name) => new RegExp(`${sdkRoot.replace(/[/\\]/g, '[/\\\\]')}[/\\\\]node_modules[/\\\\]${name}[/\\\\].*`)
    ),
  ]

  return config
}

module.exports = { getMetroConfig }
