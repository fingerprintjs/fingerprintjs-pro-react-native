// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { mergeConfig } = require('metro-config')

const { getMetroConfig } = require('../tools/metro')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

module.exports = mergeConfig(config, getMetroConfig(__dirname))
