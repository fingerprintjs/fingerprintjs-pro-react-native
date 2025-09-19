/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { SafeAreaView, ScrollView, StatusBar, useColorScheme } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

import { FingerprintJsProProvider, Region } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { Visitor } from './src/Visitor'
import { PUBLIC_API_KEY, REGION, ENDPOINT, CUSTOM_TIMEOUT } from '@env'

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const apiKey = PUBLIC_API_KEY
  const region = REGION
  const endpoint = ENDPOINT
  const customTimeout = Number(CUSTOM_TIMEOUT ?? '60000')

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // flex: 1,
    // justifyContent: 'center',
  }
  console.log(FingerprintJsProProvider)

  return (
    <FingerprintJsProProvider
      apiKey={apiKey}
      extendedResponseFormat={true}
      region={region as Region}
      endpointUrl={endpoint || undefined}
      requestOptions={{ timeout: customTimeout }}
      allowUseOfLocationData={true}
      locationTimeoutMillis={7000}
    >
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={backgroundStyle}>
          <Visitor />
        </ScrollView>
      </SafeAreaView>
    </FingerprintJsProProvider>
  )
}

export default App
