const { withProjectBuildGradle } = require('@expo/config-plugins')

// The Fingerprint Android SDK (com.fingerprint.android:pro) is hosted on a dedicated Maven repo.
// The SDK's config plugin adds it via the `android.extraMavenRepos` gradle property, but that is
// only honored by expo-modules-autolinking >= 1.11 (Expo SDK 51+). Expo 50 (RN 0.73) ships 1.10.x,
// which ignores it, so the repo is never added and the build fails with "Could not find any
// matches for com.fingerprint.android:pro". This injects it straight into the root build.gradle's
// allprojects.repositories block. Only wired in for the Expo 50 / RN 0.73 build; an Expo 50 (or
// bare RN) customer adds this repo manually the same way, per the SDK README.
const MAVEN_REPO = 'https://maven.fpregistry.io/releases'

module.exports = (config) => {
  return withProjectBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error('withAndroidMavenRepo: expected a groovy build.gradle')
    }

    const contents = gradleConfig.modResults.contents

    if (contents.includes(MAVEN_REPO)) {
      return gradleConfig
    }

    const updated = contents.replace(
      /allprojects\s*\{\s*repositories\s*\{/,
      (match) => `${match}\n        maven { url '${MAVEN_REPO}' }`
    )

    if (updated === contents) {
      throw new Error('withAndroidMavenRepo: could not find the allprojects.repositories block in build.gradle')
    }

    gradleConfig.modResults.contents = updated
    return gradleConfig
  })
}
