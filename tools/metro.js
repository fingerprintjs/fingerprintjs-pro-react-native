import path from 'path'

const hoistedModules = ['react', 'react-native']

function getMetroConfig(sdkRoot) {
  const workspaceRoot = path.resolve(__dirname, '..')
  return {
    watchFolders: [workspaceRoot],
    resolver: {
      unstable_enableSymlinks: true,
      unstable_enablePackageExports: true,
      nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
      extraNodeModules: {
        ...Object.fromEntries(hoistedModules.map((name) => [name, path.resolve(__dirname, 'node_modules', name)])),
      },
      blockList: hoistedModules.map(
        (name) => new RegExp(`${sdkRoot.replace(/[/\\]/g, '[/\\\\]')}[/\\\\]node_modules[/\\\\]${name}[/\\\\].*`)
      ),
    },
  }
}

module.exports = { getMetroConfig }
