import { Text, View } from 'react-native'

export function ArchInfo() {
  const hasTurboModules = global.__turboModuleProxy !== null
  const isBridgeless = global.RN$Bridgeless

  return (
    <View>
      <Text>{`TurboModules: ${hasTurboModules}`}</Text>
      <Text>{`Bridgeless: ${isBridgeless}`}</Text>
    </View>
  )
}
