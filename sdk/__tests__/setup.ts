jest.mock('react-native', () => {
  const RNFingerprintjsPro = {
    configure: jest.fn(),
    getVisitorData: jest.fn(),
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
    Platform: {
      OS: 'android',
      select: <T>(options: { android?: T; ios?: T; default?: T }): T | undefined => options.android ?? options.default,
    },
  }
})
