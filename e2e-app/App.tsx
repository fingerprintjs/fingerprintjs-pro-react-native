import { SafeAreaView, Text, View } from 'react-native'
import { LaunchArguments } from 'react-native-launch-arguments'

export type LaunchArgs = {
  apiKey: string
  region: string
}

const args = LaunchArguments.value<LaunchArgs>()

export default function App() {
  return (
    <View>
      <SafeAreaView
        style={{
          paddingTop: 24,
        }}
      >
        <Text>Hello World!</Text>
        <Text>API Key: {args.apiKey}</Text>
        <Text>Region: {args.region}</Text>
      </SafeAreaView>
    </View>
  )
}
