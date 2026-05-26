import type { ChangelogFunctions, GetReleaseLine, GetDependencyReleaseLine } from '@changesets/types'
import fpFormat from '@fingerprintjs/changesets-changelog-format'

const options = {
  repo: 'fingerprintjs/fingerprintjs-pro-react-native',
}

const getReleaseLine: GetReleaseLine = async (changeset, type) => {
  return fpFormat.default.getReleaseLine(changeset, type, options)
}

const getDependencyReleaseLine: GetDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  return fpFormat.default.getDependencyReleaseLine(changesets, dependenciesUpdated, options)
}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
}

export default defaultChangelogFunctions
