import React, { useState } from 'react'
import { StyleSheet, Text, Button, View, Modal, Platform } from 'react-native'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'

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
    paddingTop: '75%',
    paddingBottom: '75%',
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

  const onLoadData = () => {
    getData()
  }

  const onLoadDataWithTag = () => {
    getData(tags, linkedId)
  }

  const onLoadExtendedResult = async () => {
    await getData(tags, linkedId)
    setModalVisible(true)
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

  return (
    <View style={styles.centeredView}>
      <View style={styles.buttonsBlock}>
        <Text>{info}</Text>
        <Button title='Load data' onPress={onLoadData} />
        <Button title='Load with tag and linkedId' onPress={onLoadDataWithTag} />
        <Button title='Load extendedResult' onPress={onLoadExtendedResult} />
      </View>
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
