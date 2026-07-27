import { getNewArch } from './arch'

export function withNewArchFlag(config: { newArchEnabled?: boolean }) {
  config.newArchEnabled = getNewArch()
}

// Older expo versions require splash to be defined
export function withSplashscreen(config: { splash?: { backgroundColor?: string } }) {
  config.splash = {
    backgroundColor: '#ffffff',
  }
}

// Expo SDK 50's autolinking (1.10.x) ignores the `android.extraMavenRepos` gradle property the
// Fingerprint SDK plugin uses, so the Fingerprint Maven repo must be injected into build.gradle
// directly. Only needed for Expo 50 (RN 0.73).
export function withFingerprintMavenRepo(config: { plugins?: unknown[] }) {
  config.plugins ??= []
  config.plugins.push('./plugins/withAndroidMavenRepo.js')
}

type ExpoPlugin = string | [name: string, config: unknown]

export function withoutPlugins(...plugins: string[]) {
  const predicate = (name: string) => {
    const result = !plugins.includes(name)

    if (!result) {
      console.log('Removing plugin', name)
    }

    return result
  }

  return (config: { plugins?: ExpoPlugin[] }) => {
    config.plugins = config.plugins?.filter((plugin) => {
      if (Array.isArray(plugin)) {
        console.log('Checking plugin', plugin[0])
        return !predicate(plugin[0])
      }

      console.log('Checking plugin', plugin)

      return !predicate(plugin)
    })
    console.log('Plugins after filtering', JSON.stringify(config.plugins, null, 2))
    return config
  }
}
