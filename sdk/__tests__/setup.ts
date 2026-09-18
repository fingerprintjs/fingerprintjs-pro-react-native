jest.mock('react-native', () => {
  const RNFingerprint = {
    configure: jest.fn(),
    getVisitorData: jest.fn(),
  }

  return {
    TurboModuleRegistry: {
      get: jest.fn(() => RNFingerprint),
      getEnforcing: jest.fn(() => RNFingerprint),
    },
    // Kept so the same mock instances remain reachable via `NativeModules` (legacy access path).
    NativeModules: {
      RNFingerprint,
    },
    Platform: {
      OS: 'android',
      select: <T>(options: { android?: T; ios?: T; default?: T }): T | undefined => options.android ?? options.default,
    },
  }
})
