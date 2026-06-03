import getReleasePlan from '@changesets/get-release-plan'

export function getChangesetStatus() {
  return getReleasePlan(process.cwd())
}

export async function getPendingChangesets() {
  const pkg = await import('../../sdk/package.json', {
    // @ts-ignore
    with: { type: 'json' },
  }).then((it) => it.default)

  const changesetStatus = await getChangesetStatus()

  const changesets = changesetStatus.releases.find((release) => release.name === pkg.name)?.changesets ?? []

  return changesets.map((changesetName) => {
    const changeset = changesetStatus.changesets.find((c) => c.id === changesetName)

    return {
      id: changesetName,
      type: changeset?.releases?.find((r) => r.name === pkg.name)?.type,
    }
  })
}
