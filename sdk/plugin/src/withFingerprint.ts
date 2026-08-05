import { AndroidConfig, ConfigPlugin } from 'expo/config-plugins'

const MAVEN_REPO = 'https://maven.fpregistry.io/releases'

const { createBuildGradlePropsConfigPlugin } = AndroidConfig.BuildProperties

type Repo = { url: string }

const withFingerprint: ConfigPlugin = createBuildGradlePropsConfigPlugin([
  {
    propName: 'android.extraMavenRepos',
    propValueGetter: (config) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-unsafe-member-access
      const extraMavenRepos = (config.android?.extraMavenRepos ?? []) as Repo[]

      extraMavenRepos.push({
        url: MAVEN_REPO,
      })

      return JSON.stringify(extraMavenRepos)
    },
  },
])

export default withFingerprint
