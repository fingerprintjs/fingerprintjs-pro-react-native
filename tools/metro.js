import path from 'path'

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

  // Force every `react`/`react-native` import to resolve from the app's own node_modules, no matter where it
  // originates. With pnpm + symlinks the SDK resolves these symlinks to their real path under the monorepo root,
  // which is a different physical copy than the app's. Two React instances share no hooks dispatcher, so the SDK's
  // `useState` reads it off a `null` dispatcher ("Cannot read property 'useState' of null"). `extraNodeModules` only
  // kicks in as a fallback and `blockList` can't match the post-symlink real path, so neither dedupes on its own.
  const originalResolveRequest = config.resolver.resolveRequest
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const shouldRedirect = hoistedModules.some((name) => moduleName === name || moduleName.startsWith(`${name}/`))
    const resolver = originalResolveRequest ?? context.resolveRequest
    const resolverContext = shouldRedirect
      ? { ...context, originModulePath: path.resolve(projectRoot, 'package.json') }
      : context
    return resolver(resolverContext, moduleName, platform)
  }

  return config
}

module.exports = { getMetroConfig }
