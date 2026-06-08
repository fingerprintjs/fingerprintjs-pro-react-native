// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const sdkRoot = path.resolve(__dirname, '..', 'sdk')

const hoistedModules = ['react', 'react-native']

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true
config.watchFolders = [...(config.watchFolders ?? []), sdkRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  ...(config.resolver.nodeModulesPaths ?? []),
]
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  ...Object.fromEntries(hoistedModules.map((name) => [name, path.resolve(__dirname, 'node_modules', name)])),
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

module.exports = config
