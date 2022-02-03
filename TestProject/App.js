import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  StyleSheet,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Fpjs from 'react-native-fingerprintjs-pro';

const App = () => {
  const [visitorId, setVisitorId] = useState();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    justifyContent: 'center',
  };

  useEffect(() => {
    async function getVisitorId() {
      try {
        Fpjs.init('YOUR_BROWSER_API_TOKEN', 'YOUR_REGION');
        const visitorIdRaw = await Fpjs.getVisitorId();
        setVisitorId(visitorIdRaw);
      } catch (e) {
        console.error('RN App error: ', e);
      }
    }
    getVisitorId();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={styles.text}>
        {visitorId ? `Visitor id: ${visitorId}` : 'Loading...'}
      </Text>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  text: {alignSelf: 'center'},
});
