const { withProjectBuildGradle } = require('@expo/config-plugins')

// React Native's Gradle plugin adds a Sonatype snapshots repo to every project so RN nightly
// builds can resolve. RN <= 0.76 points it at the decommissioned https://oss.sonatype.org host,
// which now returns 504; because Gradle treats a 5xx (unlike a 404) as fatal, it disables the repo
// and fails resolution of unrelated release artifacts (e.g. androidx). RN 0.79+ moved to
// central.sonatype.com, but the old versions can't be patched. Release builds never need an RN
// snapshot, so restrict any Sonatype snapshots repo to snapshot versions only: Gradle then never
// queries it for release artifacts and never touches the dead/flaky host. No-op if no such repo
// is present (e.g. newer RN versions), so it is safe to apply to every matrix entry.
const MARKER = 'fp-sonatype-snapshots-fix'
const SNIPPET = `
// ${MARKER}
allprojects {
    repositories.all { repo ->
        if (repo instanceof org.gradle.api.artifacts.repositories.MavenArtifactRepository) {
            def repoUrl = repo.url?.toString() ?: ''
            if (repoUrl.contains('sonatype') && repoUrl.contains('snapshots')) {
                repo.mavenContent { snapshotsOnly() }
            }
        }
    }
}
`

module.exports = (config) => {
  return withProjectBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error('withSonatypeSnapshotsFix: expected a groovy build.gradle')
    }

    if (!gradleConfig.modResults.contents.includes(MARKER)) {
      gradleConfig.modResults.contents += SNIPPET
    }

    return gradleConfig
  })
}
