const { getDefaultConfig } = require('@react-native/metro-config');

const { getMetroConfig } = require('../tools/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = getMetroConfig(config, __dirname);
