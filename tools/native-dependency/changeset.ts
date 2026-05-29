import { execSync } from 'node:child_process'
import * as os from 'node:os'
import * as path from 'node:path'
import * as fs from 'node:fs'

type ReleaseType = 'patch' | 'minor' | 'major'

interface ChangesetRelease {
  name: string
  type: ReleaseType
}

interface Changeset {
  releases: ChangesetRelease[]
  summary: string
  id: string
}

interface Release {
  name: string
  type: ReleaseType
  oldVersion: string
  changesets: string[]
  newVersion: string
}

interface ChangesetStatus {
  changesets: Changeset[]
  releases: Release[]
}

export function getChangesetStatus() {
  const jsonPath = path.join(os.tmpdir(), `changset-status-${Date.now()}.json`)

  const getStatus = () => execSync(`changeset status --output ${jsonPath}`)

  try {
    getStatus()
  } catch (e) {
    if (!(e instanceof Error) || !('stderr' in e)) {
      throw e
    }

    const message = e.stderr?.toString()
    if (
      !message?.includes(
        'Failed to find where HEAD diverged from "main". Does "main" exist and it\'s synced with remote?'
      )
    ) {
      throw e
    }

    // Fetch main localy to solve the above error
    execSync('git fetch origin main:main')
    getStatus()
  }

  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as ChangesetStatus
  } finally {
    fs.promises.unlink(jsonPath)
  }
}

export async function getPendingChangesets() {
  const pkg = await import('../../sdk/package.json', {
    // @ts-ignore
    with: { type: 'json' },
  }).then((it) => it.default)

  const changesetStatus = getChangesetStatus()

  const changesets = changesetStatus.releases.find((release) => release.name === pkg.name)?.changesets ?? []

  return changesets.map((changesetName) => {
    const changeset = changesetStatus.changesets.find((c) => c.id === changesetName)

    return {
      id: changesetName,
      type: changeset?.releases?.find((r) => r.name === pkg.name)?.type,
    }
  })
}
