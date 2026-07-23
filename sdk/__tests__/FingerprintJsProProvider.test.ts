import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { createWrapper, getDefaultLoadOptions, renderProvider } from './helpers'
import { FingerprintJsProContext } from '../src/FingerprintJsProContext'
import { NativeModules } from 'react-native'
import { FingerprintJsProAgent } from '../src'

const { configure, getVisitorData, getVisitorIdWithTimeout, getVisitorDataWithTimeout } =
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  NativeModules.RNFingerprintjsPro as unknown as Record<string, jest.Mock>

const mockedVisitorId = 'some visitor id'
const mockedRequestId = 'some request id'
const mockedConfidenceScore = 0.99

const pluginVersion = '__VERSION__'

describe(`FingerprintJsProProvider`, () => {
  it('should pass options to agent with regular result', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://example.com'

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.configure).toHaveBeenCalledWith(
      options.apiKey,
      options.region,
      options.endpointUrl,
      [],
      false,
      pluginVersion,
      false,
      5000
    )
  })

  it('should pass fallbackEndpointUrls as array', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://example.com'
    options.fallbackEndpointUrls = ['https://example2.com', 'https://example3.com']

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.configure).toHaveBeenCalledWith(
      options.apiKey,
      options.region,
      options.endpointUrl,
      options.fallbackEndpointUrls,
      false,
      pluginVersion,
      false,
      5000
    )
  })

  it('should pass options to agent with extended result', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://example.com'
    options.extendedResponseFormat = true

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.configure).toHaveBeenCalledWith(
      options.apiKey,
      options.region,
      options.endpointUrl,
      [],
      options.extendedResponseFormat,
      pluginVersion,
      false,
      5000
    )
  })

  it('should pass options to agent with allowuseContextOfLocationData and locationTimeoutMillisAndroid', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://example.com'
    options.allowUseOfLocationData = true
    options.locationTimeoutMillisAndroid = 6000

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.configure).toHaveBeenCalledWith(
      options.apiKey,
      options.region,
      options.endpointUrl,
      [],
      false,
      pluginVersion,
      true,
      options.locationTimeoutMillisAndroid
    )
  })

  it('should call `getVisitorId` function when there is no timeout', () => {
    const options = getDefaultLoadOptions()
    const fingerprintClient = new FingerprintJsProAgent(options)
    void fingerprintClient.getVisitorId()

    expect(NativeModules.RNFingerprintjsPro.getVisitorId).toHaveBeenCalledWith(undefined, undefined)
  })

  it('should pass timeout to `getVisitorIdWithTimeout` function', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 18_000 }
    const fingerprintClient = new FingerprintJsProAgent(options)
    void fingerprintClient.getVisitorId()

    expect(NativeModules.RNFingerprintjsPro.getVisitorIdWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      options.requestOptions.timeout
    )
  })

  it('should pass timeout to `getVisitorIdWithTimeout` function when timeout is 0', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 0 }
    const fingerprintClient = new FingerprintJsProAgent(options)
    void fingerprintClient.getVisitorId()

    expect(NativeModules.RNFingerprintjsPro.getVisitorIdWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      options.requestOptions.timeout
    )
  })

  it('For `getVisitorId` function timeout from params should be more important than the timeout from client configuration', () => {
    const options = getDefaultLoadOptions()
    const clientTimeout = 10
    const getRequestTimeout = 200
    options.requestOptions = { timeout: clientTimeout }
    const fingerprintClient = new FingerprintJsProAgent(options)

    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }
    getVisitorIdWithTimeout.mockReturnValueOnce(
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    void fingerprintClient.getVisitorId(undefined, undefined, { timeout: getRequestTimeout })

    expect(NativeModules.RNFingerprintjsPro.getVisitorIdWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      getRequestTimeout
    )
  })

  it('should call `getVisitorData` function when there is no timeout', () => {
    const options = getDefaultLoadOptions()
    const fingerprintClient = new FingerprintJsProAgent(options)

    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }
    getVisitorData.mockReturnValueOnce(
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    void fingerprintClient.getVisitorData()

    expect(NativeModules.RNFingerprintjsPro.getVisitorData).toHaveBeenCalledWith(undefined, undefined)
  })

  it('should pass timeout to `getVisitorDataWithTimeout` function', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 18_000 }
    const fingerprintClient = new FingerprintJsProAgent(options)

    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }
    getVisitorDataWithTimeout.mockReturnValueOnce(
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    void fingerprintClient.getVisitorData()

    expect(NativeModules.RNFingerprintjsPro.getVisitorDataWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      options.requestOptions.timeout
    )
  })

  it('should pass timeout to `getVisitorDataWithTimeout` function when timeout is 0', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 0 }
    const fingerprintClient = new FingerprintJsProAgent(options)

    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }
    getVisitorDataWithTimeout.mockReturnValueOnce(
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    void fingerprintClient.getVisitorData()

    expect(NativeModules.RNFingerprintjsPro.getVisitorDataWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      options.requestOptions.timeout
    )
  })

  it('For `getVisitorData` function timeout from params should be more important than the timeout from client configuration', () => {
    const options = getDefaultLoadOptions()
    const clientTimeout = 10
    const getRequestTimeout = 200
    options.requestOptions = { timeout: clientTimeout }
    const fingerprintClient = new FingerprintJsProAgent(options)

    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }
    getVisitorDataWithTimeout.mockReturnValueOnce(
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    void fingerprintClient.getVisitorData(undefined, undefined, { timeout: getRequestTimeout })

    expect(NativeModules.RNFingerprintjsPro.getVisitorDataWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      getRequestTimeout
    )
  })

  describe('agent params changes propagation', () => {
    const pluginVersion = '__VERSION__'

    beforeEach(() => {
      configure.mockClear()
    })

    it('configures the agent once on mount', () => {
      renderProvider({ apiKey: 'key-1' })

      expect(configure).toHaveBeenCalledTimes(1)
      expect(configure).toHaveBeenLastCalledWith('key-1', undefined, undefined, [], false, pluginVersion, false, 5000)
    })

    it('reconfigures the agent when a param changes by value', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key-1' })
      expect(configure).toHaveBeenCalledTimes(1)

      rerenderWithParams({ apiKey: 'key-2' })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith('key-2', undefined, undefined, [], false, pluginVersion, false, 5000)
    })

    it('propagates changes across every configure argument', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key' })
      expect(configure).toHaveBeenLastCalledWith('key', undefined, undefined, [], false, pluginVersion, false, 5000)

      rerenderWithParams({
        apiKey: 'key',
        region: 'eu',
        endpointUrl: 'https://example.com',
        extendedResponseFormat: true,
        allowUseOfLocationData: true,
        locationTimeoutMillisAndroid: 6000,
      })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith(
        'key',
        'eu',
        'https://example.com',
        [],
        true,
        pluginVersion,
        true,
        6000
      )
    })

    it('propagates changes to array params (fallbackEndpointUrls)', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key', fallbackEndpointUrls: ['https://a.example'] })
      expect(configure).toHaveBeenLastCalledWith(
        'key',
        undefined,
        undefined,
        ['https://a.example'],
        false,
        pluginVersion,
        false,
        5000
      )

      rerenderWithParams({ apiKey: 'key', fallbackEndpointUrls: ['https://a.example', 'https://b.example'] })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith(
        'key',
        undefined,
        undefined,
        ['https://a.example', 'https://b.example'],
        false,
        pluginVersion,
        false,
        5000
      )
    })

    it('propagates changes to nested object params (requestOptions)', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key', requestOptions: { timeout: 1000 } })
      expect(configure).toHaveBeenCalledTimes(1)

      rerenderWithParams({ apiKey: 'key', requestOptions: { timeout: 2000 } })

      // `requestOptions` is not forwarded to `configure`, but changing it by value must still rebuild the
      // agent so the new request timeout takes effect.
      expect(configure).toHaveBeenCalledTimes(2)
    })

    it('does not reconfigure when re-rendered with value-equal params but fresh object identities', () => {
      const { rerenderWithParams } = renderProvider({
        apiKey: 'key',
        requestOptions: { timeout: 5000 },
        fallbackEndpointUrls: ['https://a.example'],
      })
      expect(configure).toHaveBeenCalledTimes(1)

      // Same values, brand-new object/array identities on every prop (as would happen with inline props).
      rerenderWithParams({
        apiKey: 'key',
        requestOptions: { timeout: 5000 },
        fallbackEndpointUrls: ['https://a.example'],
      })

      expect(configure).toHaveBeenCalledTimes(1)
    })
  })
})
