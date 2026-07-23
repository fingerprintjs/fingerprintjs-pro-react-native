jest.mock('react-native', () => {
  const RNFingerprintjsPro = {
    configure: jest.fn(),
    getVisitorId: jest.fn(),
    getVisitorData: jest.fn(),
    getVisitorDataWithTimeout: jest.fn(),
    getVisitorIdWithTimeout: jest.fn(),
  }

  return {
    TurboModuleRegistry: {
      get: jest.fn(() => RNFingerprintjsPro),
      getEnforcing: jest.fn(() => RNFingerprintjsPro),
    },
    // Kept so the same mock instances remain reachable via `NativeModules` (legacy access path).
    NativeModules: {
      RNFingerprintjsPro,
    },
  }
})
