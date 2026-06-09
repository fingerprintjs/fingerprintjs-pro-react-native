const { getDefaultConfig } = require('@react-native/metro-config')
const { getMetroConfig } = require('../tools/metro')

const config = getDefaultConfig(__dirname)
module.exports = getMetroConfig(config, __dirname)
