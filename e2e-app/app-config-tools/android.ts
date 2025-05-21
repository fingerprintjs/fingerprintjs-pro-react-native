const androidBuildProperties = {
  minSdkVersion: 24,
  compileSdkVersion: 35,
  targetSdkVersion: 35,
  buildToolsVersion: '34.0.0',
} as Record<string, any>

export function stripAndroidExtraBuildProperties() {
  delete androidBuildProperties.compileSdkVersion
  delete androidBuildProperties.targetSdkVersion
  delete androidBuildProperties.buildToolsVersion
}

export function getAndroidBuildProperties() {
  return { ...androidBuildProperties }
}
