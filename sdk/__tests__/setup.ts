jest.mock('react-native', () => {
  const configure = jest.fn()
  const getVisitorId = jest.fn()
  const getVisitorData = jest.fn()
  const getVisitorDataWithTimeout = jest.fn()
  const getVisitorIdWithTimeout = jest.fn()

  return {
    NativeModules: {
      RNFingerprintjsPro: {
        configure,
        getVisitorId,
        getVisitorData,
        getVisitorDataWithTimeout,
        getVisitorIdWithTimeout,
      },
    },
  }
})
