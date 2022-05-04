import React from 'react'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { FingerprintJsProProvider } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { Visitor } from './src/Visitor'

const apiKey = 'insert_api_key_here'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    justifyContent: 'center',
  }

  return (
    <FingerprintJsProProvider apiKey={apiKey}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Visitor />
      </SafeAreaView>
    </FingerprintJsProProvider>
  )
}

export default App
