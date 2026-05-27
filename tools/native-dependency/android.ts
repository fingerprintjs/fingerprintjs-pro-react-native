import { humanizeMavenStyleVersionRange } from './utils.ts'
import { join } from 'node:path'
import { getCommand } from './gradle.ts'
import { spawn } from 'node:child_process'

export interface AndroidPlatformConfiguration {
  path: string
  gradleTaskName: string
  displayName: string | undefined
}

async function runGradleTask(androidPath: string, androidGradleTaskName: string): Promise<string> {
  const androidFullPath = join(process.cwd(), androidPath)
  const command = await getCommand(androidFullPath)

  return new Promise((resolve, reject) => {
    const child = spawn(command, [androidGradleTaskName, '-q', '--console=plain'], {
      cwd: androidFullPath,
      detached: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    })
    if (child.stdout === null) {
      reject(new Error('Unexpected error: stdout of subprocess is null'))
      return
    }
    if (child.stderr === null) {
      reject(new Error('Unexpected error: stderr of subprocess is null'))
      return
    }

    let androidVersion: string | null = null
    child.stdout.on('data', (line: Buffer) => {
      if (!line || line.toString().trim() === '') {
        return
      }

      androidVersion = line.toString().trim()
    })
    child.stderr.on('data', (line: Buffer) => {
      console.error(line.toString().trim())
    })
    child.on('close', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Unexpected error: Gradle failed with status code ${code}`))
        return
      }

      if (androidVersion === null) {
        reject(new Error(`Could not read output of \`${androidGradleTaskName}\` gradle task.`))
        return
      }

      resolve(androidVersion)
    })
    child.on('error', (err) => {
      console.error(err)
      reject(err)
    })
  })
}

export async function resolveAndroidDependency({ path, gradleTaskName }: AndroidPlatformConfiguration) {
  const androidVersion = await runGradleTask(path, gradleTaskName)
  return humanizeMavenStyleVersionRange(androidVersion)
}
