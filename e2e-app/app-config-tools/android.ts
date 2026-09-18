export type AndroidBuildProperties = {
  minSdkVersion: number
  compileSdkVersion?: number
  targetSdkVersion?: number
  buildToolsVersion?: string
  enableBundleCompression: boolean
}

const androidBuildProperties: AndroidBuildProperties = {
  minSdkVersion: 24,
  compileSdkVersion: 36,
  targetSdkVersion: 35,
  buildToolsVersion: '34.0.0',
  enableBundleCompression: false,
}

export function getAndroidBuildProperties() {
  return { ...androidBuildProperties }
}
