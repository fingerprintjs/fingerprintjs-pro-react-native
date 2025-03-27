const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

config.watchFolders = [path.resolve(__dirname, '../')]
config.resolver.nodeModulesPaths = [path.resolve('./node_modules'), path.resolve('../node_modules')]

module.exports = config
