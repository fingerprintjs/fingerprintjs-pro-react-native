// SafeAreaView is deprecated in newer RN versions, react-native-safe-area-context is recommended
// but it doesn't work nicely with older RN versions that we also run tests against, so keep SafeAreaView import from react-native for now
import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { FingerprintJsProProvider, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { testIds } from '@/e2e/ids'
import { useEffect } from 'react'
import { testTags } from '@/e2e/tags'
import config from '@/src/config'

function InnerApp() {
  const { isLoading, error, data, getData } = useVisitorData()

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <View style={{ flex: 1 }}>
      {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
      <SafeAreaView
        style={{
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {isLoading ? <Text testID={testIds.loading}>Loading...</Text> : null}
        {error ? (
          <View>
            <Text testID={testIds.errorName}>{error.name}</Text>
            <Text testID={testIds.errorMessage}>{error.message}</Text>
            {error.stack ? <Text testID={testIds.errorStack}>{error.stack}</Text> : null}
            {error.cause ? <Text testID={testIds.errorCause}>{JSON.stringify(error.cause)}</Text> : null}
          </View>
        ) : null}
        {data ? <Text testID={testIds.data}>{JSON.stringify(data)}</Text> : null}
        <Pressable
          testID={testIds.getData}
          onPress={async () => {
            const tags = config.useTags ? testTags : undefined

            await getData(tags, config.linkedId)
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
    <FingerprintJsProProvider apiKey={config.apiKey} region={config.region}>
      <InnerApp />
    </FingerprintJsProProvider>
  )
}
