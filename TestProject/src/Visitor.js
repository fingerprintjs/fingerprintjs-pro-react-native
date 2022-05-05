import React from 'react'
import { StyleSheet, Text, Button } from 'react-native'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'

const styles = StyleSheet.create({
  text: { alignSelf: 'center' },
  button: { alignSelf: 'end' },
})

export const Visitor = () => {
  const { isLoading, data, getData, error } = useVisitorData()

  const onLoadData = () => {
    getData()
  }

  const onLoadDataWithTag = () => {
    getData({ testTag: 'ReactNative' })
  }

  let info = 'Loading...'
  if (!isLoading) {
    if (error) {
      info = `${error.name}: ${error.message}`
    } else {
      info = `Visitor id: ${data?.visitorId}`
    }
  }

  return (
    <>
      <Text style={styles.text}>{info}</Text>
      <Button style={styles.button} title='Load data' onPress={onLoadData} />
      <Button style={styles.button} title='Load data with tag' onPress={onLoadDataWithTag} />
    </>
  )
}
