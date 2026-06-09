import path from 'path'

const hoistedModules = ['react', 'react-native']

function getMetroConfig(projectRoot) {
  const sdkRoot = path.resolve(__dirname, '..', 'sdk')
  return {
    watchFolders: [sdkRoot],
    resolver: {
      unstable_enableSymlinks: true,
      unstable_enablePackageExports: true,
      nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
      extraNodeModules: {
        ...Object.fromEntries(hoistedModules.map((name) => [name, path.resolve(projectRoot, 'node_modules', name)])),
      },
      blockList: hoistedModules.map(
        (name) => new RegExp(`${projectRoot.replace(/[/\\]/g, '[/\\\\]')}[/\\\\]node_modules[/\\\\]${name}[/\\\\].*`)
      ),
    },
  }
}

module.exports = { getMetroConfig }
