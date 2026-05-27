import { join } from 'node:path'
import { access, constants } from 'node:fs'
import { exec } from 'node:child_process'
import { isNotFoundErrorCode } from './utils.ts'

/**
 * Check if gradle is installed to system-wide.
 * @return A promise that resolves with `true` if gradle is found,
 *        `false` if gradle is not found,
 *        and rejects with an error if there is an issue checking for Gradle.
 */
export function isGradleAvailable(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    exec('gradle --version', (err) => {
      if (err) {
        if (isNotFoundErrorCode(err.code)) {
          resolve(false)
        }
        reject(err)
      }

      resolve(true)
    })
  })
}

/**
 * @param {string} cwd the path of current working directory
 * @return A promise that resolves name of command to trigger Gradle
 */
export function getCommand(cwd: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const gradleWrapper = join(cwd, 'gradlew')
    access(gradleWrapper, constants.F_OK, async (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          if (await isGradleAvailable()) {
            resolve('gradle')
          }

          reject(new Error('Gradle or Gradle wrapper not found.'))
        } else {
          reject(err)
        }
      } else {
        resolve(gradleWrapper)
      }
    })
  })
}
