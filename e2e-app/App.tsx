// SafeAreaView is deprecated in newer RN versions, react-native-safe-area-context is recommended
// but it doesn't work nicely with older RN versions that we also run tests against, so keep SafeAreaView import from react-native for now
/* eslint-disable @typescript-eslint/no-deprecated */
import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { FingerprintJsProProvider, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { testIds } from '@/e2e/ids'
import { useEffect } from 'react'
import { testTags } from '@/e2e/tags'
import config from '@/src/config'
import { ArchInfo } from '@/src/components/ArchInfo'

function InnerApp() {
  const { isLoading, error, data, getData } = useVisitorData()

  const doGetData = async () => {
    const tags = config.useTags ? testTags : undefined

    await getData(tags, config.linkedId)
  }

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
        <ArchInfo />
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

        <View style={{ marginTop: 24, marginBottom: 24, alignItems: 'center' }}>
          <Pressable
            testID={testIds.getData}
            onPress={doGetData}
            style={{
              padding: 12,
              backgroundColor: '#2196F3',
              borderRadius: 8,
              marginBottom: 12,
              minWidth: 200,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Get data</Text>
          </Pressable>
        </View>
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
