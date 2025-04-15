import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { LaunchArguments } from 'react-native-launch-arguments'
import { FingerprintJsProProvider, Region, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { testIds } from '@/e2e/ids'
import { useEffect } from 'react'
import { testTags } from '@/e2e/tags'

export type LaunchArgs = {
  apiKey: string
  region: Region
  useTags?: boolean
  linkedId?: string
}

const args = LaunchArguments.value<LaunchArgs>()

function InnerApp() {
  const { isLoading, error, data, getData } = useVisitorData()

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {isLoading && <Text testID={testIds.loading}>Loading...</Text>}
        {error && (
          <View>
            <Text testID={testIds.errorName}>{error.name}</Text>
            <Text testID={testIds.errorMessage}>{error.message}</Text>
            {error.stack && <Text testID={testIds.errorStack}>{error.stack}</Text>}
            {Boolean(error.cause) && <Text testID={testIds.errorCause}>{JSON.stringify(error.cause)}</Text>}
          </View>
        )}
        {data && <Text testID={testIds.data}>{JSON.stringify(data)}</Text>}
        <Pressable
          testID={testIds.getData}
          onPress={async () => {
            const tags = args.useTags ? testTags : undefined

            await getData(tags, args.linkedId)
          }}
          style={{
            paddingBottom: 48,
            paddingLeft: 24,
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
