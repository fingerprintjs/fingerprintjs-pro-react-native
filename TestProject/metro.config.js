const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

const hoistedModules = ['react', 'react-native']

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    unstable_enableSymlinks: true,
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    resolveRequest: (context, moduleName, platform) => {
      const root = moduleName.split('/')[0]
      if (hoistedModules.includes(root)) {
        return context.resolveRequest(
          { ...context, originModulePath: path.join(projectRoot, 'index.js') },
          moduleName,
          platform
        )
      }
      return context.resolveRequest(context, moduleName, platform)
    },
  },
}

module.exports = mergeConfig(getDefaultConfig(projectRoot), config)
