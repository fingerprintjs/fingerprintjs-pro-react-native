import { exec } from 'node:child_process'
import { isNotFoundErrorCode } from './utils.ts'

/**
 * Checks whether CocoaPods are installed and available on the system by executing the `pod --version` command.
 * Resolves to `true` if CocoaPods are available, resolves to `false` if CocoaPods are not installed,
 * and rejects with an error if another issue occurs.
 *
 * @return {Promise<boolean>} A promise that resolves to `true` if CocoaPods are installed `false` otherwise.
 */
export function isPodAvailable(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    exec('pod --version', (err) => {
      if (err) {
        if (isNotFoundErrorCode(err.code)) {
          resolve(false)
          return
        }
        reject(err)
        return
      }

      resolve(true)
    })
  })
}

/**
 * Executes the `pod ipc spec` command on the given podspec file and returns the parsed result as an object.
 *
 * @param {string} podspecFile - The path to the `.podspec` file to be processed.
 * @return {Promise<PodspecJson>} A promise that resolves to the parsed PodspecJson object or rejects with an error if the command fails.
 */
export function podIpcSpec(podspecFile: string): Promise<PodspecJson> {
  return new Promise<PodspecJson>((resolve, reject) => {
    exec(`pod ipc spec ${podspecFile}`, (err, stdout) => {
      if (err) {
        reject(err)
        return
      }

      try {
        resolve(JSON.parse(stdout) as PodspecJson)
      } catch {
        reject(new Error('Failed to parse podspec file'))
      }
    })
  })
}

export type PodspecJson = {
  dependencies: {
    [key: string]: [string]
  }
}
