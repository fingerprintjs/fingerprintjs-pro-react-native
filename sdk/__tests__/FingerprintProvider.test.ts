import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { createWrapper, getDefaultLoadOptions, renderProvider } from './helpers'
import { FingerprintContext } from '../src'
import { NativeModules } from 'react-native'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const { configure } = NativeModules.RNFingerprintjsPro as unknown as Record<string, jest.Mock>

const pluginVersion = '__VERSION__'

describe('FingerprintProvider', () => {
  beforeEach(() => {
    configure.mockClear()
  })

  it('configures with a single endpoint as endpointUrl', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpoints = 'https://example.com'

    renderHook(() => useContext(FingerprintContext), { wrapper: createWrapper(options) })

    expect(configure).toHaveBeenCalledWith(options.apiKey, pluginVersion, [], false, 5000, 'us', 'https://example.com')
  })

  it('splits multiple endpoints into endpointUrl + fallbacks', () => {
    const options = getDefaultLoadOptions()
    options.endpoints = ['https://primary.com', 'https://fallback1.com', 'https://fallback2.com']

    renderHook(() => useContext(FingerprintContext), { wrapper: createWrapper(options) })

    expect(configure).toHaveBeenCalledWith(
      options.apiKey,
      pluginVersion,
      ['https://fallback1.com', 'https://fallback2.com'],
      false,
      5000,
      null,
      'https://primary.com'
    )
  })

  it('forwards Android location options on Android', () => {
    const options = getDefaultLoadOptions()
    options.android = { allowUseOfLocationData: true, locationTimeoutMillis: 6000 }

    renderHook(() => useContext(FingerprintContext), { wrapper: createWrapper(options) })

    expect(configure).toHaveBeenCalledWith(options.apiKey, pluginVersion, [], true, 6000, null, null)
  })

  describe('start options changes propagation', () => {
    it('configures the client once on mount', () => {
      renderProvider({ apiKey: 'key-1' })

      expect(configure).toHaveBeenCalledTimes(1)
      expect(configure).toHaveBeenLastCalledWith('key-1', pluginVersion, [], false, 5000, null, null)
    })

    it('reconfigures when an option changes by value', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key-1' })
      expect(configure).toHaveBeenCalledTimes(1)

      rerenderWithParams({ apiKey: 'key-2' })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith('key-2', pluginVersion, [], false, 5000, null, null)
    })

    it('propagates changes across every configure argument', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key' })

      rerenderWithParams({
        apiKey: 'key',
        region: 'eu',
        endpoints: 'https://example.com',
        android: { allowUseOfLocationData: true, locationTimeoutMillis: 6000 },
      })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith('key', pluginVersion, [], true, 6000, 'eu', 'https://example.com')
    })

    it('does not reconfigure when re-rendered with value-equal options but fresh identities', () => {
      const { rerenderWithParams } = renderProvider({
        apiKey: 'key',
        endpoints: ['https://a.example'],
        android: { locationTimeoutMillis: 5000 },
      })
      expect(configure).toHaveBeenCalledTimes(1)

      rerenderWithParams({
        apiKey: 'key',
        endpoints: ['https://a.example'],
        android: { locationTimeoutMillis: 5000 },
      })

      expect(configure).toHaveBeenCalledTimes(1)
    })
  })
})
