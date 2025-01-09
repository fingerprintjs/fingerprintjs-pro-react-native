import React, { useState } from 'react'
import { StyleSheet, Text, Button, View, Modal, Platform } from 'react-native'
import {
  FingerprintJsProAgent,
  useVisitorData,
  ClientTimeoutError,
} from '@fingerprintjs/fingerprintjs-pro-react-native'
import { PUBLIC_API_KEY, REGION, ENDPOINT } from '@env'

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonsBlock: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: '60%',
    paddingBottom: '60%',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
  },
})

const tags = {
  a: 'a',
  b: 0,
  c: {
    foo: true,
    bar: [1, 2, 3],
  },
  d: false,
}

const linkedId = 'React native'

export const Visitor = () => {
  const { isLoading, data, getData, error } = useVisitorData()

  const [modalVisible, setModalVisible] = useState(false)
  const [sealedResultModalVisible, setSealedResultModalVisible] = useState(false)
  const [testResults, setTestResults] = useState('tests not running')

  const onLoadData = () => {
    getData()
  }

  const onLoadSealedResult = () => {
    getData()
    setSealedResultModalVisible(true)
  }

  const onLoadDataWithTag = () => {
    getData(tags, linkedId)
  }

  const onLoadExtendedResult = async () => {
    await getData(tags, linkedId)
    setModalVisible(true)
  }

  const onRunTestsPressed = async () => {
    setTestResults('Running tests')
    try {
      await runTests()
      setTestResults('Success!')
    } catch (error) {
      setTestResults(`Failed: ${error}`)
    }
  }

  const runTests = async () => {
    const fingerprintClient = new FingerprintJsProAgent({
      apiKey: PUBLIC_API_KEY,
      region: REGION,
      endpointUrl: ENDPOINT,
    })

    const tags = {
      a: 'a',
      b: 0,
      c: {
        foo: true,
        bar: [1, 2, 3],
      },
      d: false,
    }
    const tests = [
      () => fingerprintClient.getVisitorId(),
      () => fingerprintClient.getVisitorData(),
      () => fingerprintClient.getVisitorId(null, 'checkId'),
      () => fingerprintClient.getVisitorData(null, 'checkData'),
      () => fingerprintClient.getVisitorId(tags),
      () => fingerprintClient.getVisitorData(tags),
      () => fingerprintClient.getVisitorId(tags, 'checkIdWithTag'),
      () => fingerprintClient.getVisitorData(tags, 'checkDataWithTag'),
      () => fingerprintClient.getVisitorId(null, null, { timeout: 5_000 }),
      () => fingerprintClient.getVisitorData(null, null, { timeout: 5_000 }),
    ]

    const timeoutTests = [
      () => fingerprintClient.getVisitorId(null, null, { timeout: 5 }),
      () => fingerprintClient.getVisitorData(null, null, { timeout: 5 }),
    ]

    for (const test of tests) {
      await test()
      setTestResults((testResult) => `${testResult}.`)
    }

    for (const test of timeoutTests) {
      try {
        await test()
        throw new Error('Expected timeout for test')
      } catch (e) {
        if (e instanceof ClientTimeoutError) {
          setTestResults((testResult) => `${testResult}!`)
        } else {
          throw e
        }
      }
    }
  }

  let info = 'Loading...'
  if (!isLoading) {
    if (error) {
      info = `${error.name}: ${error.message}`
    } else {
      info = `Visitor id: ${data?.visitorId}`
    }
  }

  const extendedResult = JSON.stringify(data, null, '  ')
  const sealedResultInfo = JSON.stringify(data?.sealedResult ?? '', null, '  ')

  return (
    <View style={styles.centeredView}>
      <View style={styles.buttonsBlock}>
        <Text>{info}</Text>
        <Button title='Load data' onPress={onLoadData} />
        <Button title='Load with tag and linkedId' onPress={onLoadDataWithTag} />
        <Button title='Load extendedResult' onPress={onLoadExtendedResult} />
        <Button title='Load sealedResult' onPress={onLoadSealedResult} />
        <Button title='Run tests!' onPress={onRunTestsPressed} />
        <Text>{testResults}</Text>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={sealedResultModalVisible}
        onRequestClose={() => {
          setSealedResultModalVisible(!setSealedResultModalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.monoText}>{sealedResultInfo}</Text>
            <Button title='Close' onPress={() => setSealedResultModalVisible(!sealedResultModalVisible)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.monoText}>{extendedResult}</Text>
            <Button title='Close' onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}
