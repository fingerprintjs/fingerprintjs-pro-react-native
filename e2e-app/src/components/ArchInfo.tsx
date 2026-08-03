import { Text, View } from 'react-native'
import { testIds } from '@/e2e/ids'

export function ArchInfo() {
  const hasTurboModules = global.__turboModuleProxy !== null
  const isBridgeless = global.RN$Bridgeless
  const uiManager = global.nativeFabricUIManager ? 'Fabric' : 'Paper'

  return (
    <View>
      <Text>{`TurboModules: ${hasTurboModules}`}</Text>
      <Text>{`Bridgeless: ${isBridgeless}`}</Text>
      <Text>UI Manager:</Text>
      <Text testID={testIds.uiManager}>{uiManager}</Text>
    </View>
  )
}
