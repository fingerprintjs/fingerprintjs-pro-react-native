const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { getMetroConfig } = require('../tools/metro')

module.exports = mergeConfig(getDefaultConfig(__dirname), getMetroConfig(__dirname))
