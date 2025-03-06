import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { LaunchArguments } from 'react-native-launch-arguments'
import { FingerprintJsProProvider, Region, Tags, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { testIds } from '@/e2e/ids'
import { useEffect } from 'react'

export type LaunchArgs = {
  apiKey: string
  region: Region
  tags?: Tags
  linkedId?: string
}

const args = LaunchArguments.value<LaunchArgs>()

function InnerApp() {
  const { isLoading, error, data, getData } = useVisitorData()

  useEffect(() => {
    console.log('App loaded')
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}
      >
        {isLoading && <Text testID={testIds.loading}>Loading...</Text>}
        {error && (
          <View>
            <Text testID={testIds.errorName}>{error.name}</Text>
            <Text testID={testIds.errorMessage}>{error.message}</Text>
          </View>
        )}
        {data && <Text testID={testIds.data}>{JSON.stringify(data)}</Text>}
        <Pressable
          testID={testIds.getData}
          onPress={() => getData(args.tags, args.linkedId)}
          style={{
            paddingBottom: 48,
            paddingLeft: 24
          }}
        >
          <Text>Get data</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  )
}

export default function App() {
  return (
    <FingerprintJsProProvider apiKey={args.apiKey} region={args.region}>
      <InnerApp />
    </FingerprintJsProProvider>
  )
}
