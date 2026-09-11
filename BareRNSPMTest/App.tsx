// SafeAreaView is deprecated in newer RN versions, react-native-safe-area-context is recommended
// but it doesn't work nicely with older RN versions that we also run tests against, so keep SafeAreaView import from react-native for now
// The bare rn app will be removed before merging
/* eslint-disable */
import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { FingerprintProvider, isFingerprintError, useVisitorData } from '@fingerprint/react-native'
import { useEffect } from 'react'
import { API_KEY } from '@env'
function InnerApp() {
  const { isLoading, error, data, getData } = useVisitorData()

  const doGetData = async () => {
    try {
      await getData()
    } catch {
      // `getData` rejects on failure, but the error is also stored in the hook state and rendered below.
    }
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
        {isLoading ? <Text>Loading...</Text> : null}
        {error ? (
          <View>
            <Text>Name:</Text>
            <Text>{error.name}</Text>

            <Text>Code:</Text>
            <Text>{error.code}</Text>

            <Text>Message:</Text>
            <Text>{error.message}</Text>

            {isFingerprintError(error) && (
              <>
                <Text>Error event id</Text>
                <Text>{error.event_id}</Text>
              </>
            )}

            {error.stack ? <Text>{error.stack}</Text> : null}
            {error.cause ? <Text>{JSON.stringify(error.cause)}</Text> : null}
          </View>
        ) : null}
        {data ? <Text>{JSON.stringify(data)}</Text> : null}

        <View style={{ marginTop: 24, marginBottom: 24, alignItems: 'center' }}>
          <Pressable
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
    <FingerprintProvider apiKey={API_KEY}>
      <InnerApp />
    </FingerprintProvider>
  )
}
