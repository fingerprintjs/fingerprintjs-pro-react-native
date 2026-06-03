import type { ChangelogFunctions, GetDependencyReleaseLine, GetReleaseLine } from '@changesets/types'
import fpFormat from '@fingerprintjs/changesets-changelog-format'
import { generateNativeDepsNote } from './native-dependency/note.ts'
import { getPendingChangesets } from './native-dependency/changeset.ts'

const options = {
  repo: 'fingerprintjs/fingerprintjs-pro-react-native',
}

const lastChangesetPromise = getPendingChangesets().then((changesets) => {
  for (const type of changeTypesOrder) {
    const changeset = changesets.find((c) => c.type === type)

    if (changeset) {
      return changeset.id
    }
  }

  return undefined
})

// Order in which change types appear as last in the changelog
// We use it to find the changeset that appears last in the changelog and append native deps note to it, so that it always appears last
const changeTypesOrder = ['patch', 'minor', 'major']

const getReleaseLine: GetReleaseLine = async (changeset, type) => {
  const lastChangeset = await lastChangesetPromise
  const isLastChangeset = lastChangeset === changeset.id

  let line = await fpFormat.default.getReleaseLine(changeset, type, options)

  if (isLastChangeset) {
    try {
      const nativeDepsNote = await generateNativeDepsNote()
      line += `\n\n ${nativeDepsNote}`
    } catch (e) {
      console.error('Failed to generate native dependencies note', e)
    }
  }

  return line
}

const getDependencyReleaseLine: GetDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  return fpFormat.default.getDependencyReleaseLine(changesets, dependenciesUpdated, options)
}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
}

export default defaultChangelogFunctions
