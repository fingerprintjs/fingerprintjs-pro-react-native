const { withGradleProperties } = require('@expo/config-plugins')

// Expo plugin that modifies gradle.properties
module.exports = (expoConfig) => {
  const newProperties = [
    // Allocate more memory for android build
    {
      type: 'property',
      key: 'org.gradle.jvmargs',
      value: '-Xmx2408m -XX:MaxMetaspaceSize=1024m',
    },
  ]

  return withGradleProperties(expoConfig, (gradleConfig) => {
    newProperties.forEach((gradleProperty) => {
      const existingProperty = gradleConfig.modResults.find(
        (v) => v.type === gradleProperty.type && v.key === gradleProperty.key
      )

      if (existingProperty) {
        gradleConfig.modResults[gradleConfig.modResults.indexOf(existingProperty)] = gradleProperty
        return
      }

      gradleConfig.modResults.push(gradleProperty)
    })

    return gradleConfig
  })
}
