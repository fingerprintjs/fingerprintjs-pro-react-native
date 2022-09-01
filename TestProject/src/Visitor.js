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
    const tags = {
      a: 'a',
      b: 0,
      c: {
        foo: true,
        bar: [1, 2, 3],
      },
      d: false,
    }
    getData(tags, 'React native')
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
      <Button style={styles.button} title='Load with tag and linkedId' onPress={onLoadDataWithTag} />
    </>
  )
}
