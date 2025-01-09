import React from 'react'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { FingerprintJsProProvider } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { Visitor } from './src/Visitor'
import { PUBLIC_API_KEY, REGION, ENDPOINT, CUSTOM_TIMEOUT } from '@env'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const apiKey = PUBLIC_API_KEY
  const region = REGION
  const endpoint = ENDPOINT
  const customTimeout = Number(CUSTOM_TIMEOUT ?? '60000')

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    justifyContent: 'center',
  }

  return (
    <FingerprintJsProProvider
      apiKey={apiKey}
      extendedResponseFormat={true}
      region={region}
      endpointUrl={endpoint}
      requestOptions={{ timeout: customTimeout }}
    >
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Visitor />
      </SafeAreaView>
    </FingerprintJsProProvider>
  )
}

export default App
