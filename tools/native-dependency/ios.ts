import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { isPodAvailable, podIpcSpec, type PodspecJson } from './pods.ts'

export interface IOSPlatformConfiguration {
  podSpecPath: string
  dependencyName: string
  displayName: string | undefined
}

export async function resolveIOSDependency({ podSpecPath, dependencyName }: IOSPlatformConfiguration) {
  let podspecContents: PodspecJson | undefined

  try {
    podspecContents = readPodspecJson(podSpecPath)
  } catch (e) {
    const podspecDSLPath = join(podSpecPath)
    podspecContents = await readPodspecDSL(podspecDSLPath)
  }

  if (!podspecContents.dependencies || !podspecContents.dependencies[dependencyName]) {
    throw new Error(`${podSpecPath} file does not contain '${dependencyName}' in dependencies.`)
  }

  return podspecContents.dependencies[dependencyName].join(' and ')
}

async function readPodspecDSL(podspecFilePath: string): Promise<PodspecJson> {
  if (!(await isPodAvailable())) {
    throw new Error(`Pods not found in your system.`)
  }

  return podIpcSpec(podspecFilePath)
}

function readPodspecJson(podspecFilePath: string): PodspecJson {
  const resolvedPodspecPath = join(process.cwd(), podspecFilePath)

  let fileContent: string
  try {
    fileContent = readFileSync(resolvedPodspecPath, 'utf8')
  } catch (error: any) {
    switch (error.code) {
      case 'ENOENT':
        throw new Error(`${podspecFilePath} file does not exist.`)
      case 'EACCES':
        throw new Error(`${podspecFilePath} file cannot be accessed.`)
      default:
        throw new Error(`${podspecFilePath} file cannot be read. Error: ${error.message}`)
    }
  }

  let data: PodspecJson
  try {
    data = JSON.parse(fileContent) as PodspecJson
  } catch (error) {
    throw new Error('Failed to parse podspec JSON. Please check the podspec file format.')
  }

  return data
}
