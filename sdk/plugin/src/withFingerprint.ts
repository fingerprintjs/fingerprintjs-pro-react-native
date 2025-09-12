import { AndroidConfig, ConfigPlugin } from 'expo/config-plugins'

const MAVEN_REPO = 'https://maven.fpregistry.io/releases'

const { createBuildGradlePropsConfigPlugin } = AndroidConfig.BuildProperties

const withFingerprint: ConfigPlugin = createBuildGradlePropsConfigPlugin([
  {
    propName: 'android.extraMavenRepos',
    propValueGetter: (config) => {
      const extraMavenRepos = config.android?.extraMavenRepos ?? []

      extraMavenRepos.push({
        url: MAVEN_REPO,
      })

      return JSON.stringify(extraMavenRepos)
    },
  },
])

export default withFingerprint
