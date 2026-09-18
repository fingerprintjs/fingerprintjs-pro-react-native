import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { createWrapper, getDefaultLoadOptions, renderProvider } from './helpers'
import { FingerprintJsProContext } from '../src/FingerprintJsProContext'
import { NativeModules } from 'react-native'
import { FingerprintJsProAgent } from '../src'

const { configure, getVisitorId, getVisitorData } =
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

    expect(configure).toHaveBeenCalledWith(
      options.apiKey,
      pluginVersion,
      false,
      [],
      false,
      5000,
      options.region,
      options.endpointUrl
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

    expect(configure).toHaveBeenCalledWith(
      options.apiKey,
      pluginVersion,
      false,
      options.fallbackEndpointUrls,
      false,
      5000,
      options.region,
      options.endpointUrl
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

    expect(configure).toHaveBeenCalledWith(
      options.apiKey,
      pluginVersion,
      options.extendedResponseFormat,
      [],
      false,
      5000,
      options.region,
      options.endpointUrl
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

    expect(configure).toHaveBeenCalledWith(
      options.apiKey,
      pluginVersion,
      false,
      [],
      true,
      options.locationTimeoutMillisAndroid,
      options.region,
      options.endpointUrl
    )
  })

  it('should call `getVisitorId` function when there is no timeout', () => {
    const options = getDefaultLoadOptions()
    const fingerprintClient = new FingerprintJsProAgent(options)
    void fingerprintClient.getVisitorId()

    expect(getVisitorId).toHaveBeenCalledWith(null, null, null)
  })

  it('should pass timeout to `getVisitorId` function', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 18_000 }
    const fingerprintClient = new FingerprintJsProAgent(options)
    void fingerprintClient.getVisitorId()

    expect(getVisitorId).toHaveBeenCalledWith(null, null, options.requestOptions.timeout)
  })

  it('should pass timeout to `getVisitorId` function when timeout is 0', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 0 }
    const fingerprintClient = new FingerprintJsProAgent(options)
    void fingerprintClient.getVisitorId()

    expect(getVisitorId).toHaveBeenCalledWith(null, null, options.requestOptions.timeout)
  })

  it('For `getVisitorId` function timeout from params should be more important than the timeout from client configuration', () => {
    const options = getDefaultLoadOptions()
    const clientTimeout = 10
    const getRequestTimeout = 200
    options.requestOptions = { timeout: clientTimeout }
    const fingerprintClient = new FingerprintJsProAgent(options)

    getVisitorId.mockReturnValueOnce(Promise.resolve(mockedVisitorId))

    void fingerprintClient.getVisitorId(undefined, undefined, { timeout: getRequestTimeout })

    expect(getVisitorId).toHaveBeenCalledWith(null, null, getRequestTimeout)
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

    expect(getVisitorData).toHaveBeenCalledWith(null, null, null)
  })

  it('should pass timeout to `getVisitorData` function', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 18_000 }
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

    expect(getVisitorData).toHaveBeenCalledWith(null, null, options.requestOptions.timeout)
  })

  it('should pass timeout to `getVisitorData` function when timeout is 0', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 0 }
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

    expect(getVisitorData).toHaveBeenCalledWith(null, null, options.requestOptions.timeout)
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
    getVisitorData.mockReturnValueOnce(
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    void fingerprintClient.getVisitorData(undefined, undefined, { timeout: getRequestTimeout })

    expect(getVisitorData).toHaveBeenCalledWith(null, null, getRequestTimeout)
  })

  describe('agent params changes propagation', () => {
    const pluginVersion = '__VERSION__'

    beforeEach(() => {
      configure.mockClear()
    })

    it('configures the agent once on mount', () => {
      renderProvider({ apiKey: 'key-1' })

      expect(configure).toHaveBeenCalledTimes(1)
      expect(configure).toHaveBeenLastCalledWith('key-1', pluginVersion, false, [], false, 5000, null, null)
    })

    it('reconfigures the agent when a param changes by value', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key-1' })
      expect(configure).toHaveBeenCalledTimes(1)

      rerenderWithParams({ apiKey: 'key-2' })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith('key-2', pluginVersion, false, [], false, 5000, null, null)
    })

    it('propagates changes across every configure argument', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key' })
      expect(configure).toHaveBeenLastCalledWith('key', pluginVersion, false, [], false, 5000, null, null)

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
        pluginVersion,
        true,
        [],
        true,
        6000,
        'eu',
        'https://example.com'
      )
    })

    it('propagates changes to array params (fallbackEndpointUrls)', () => {
      const { rerenderWithParams } = renderProvider({ apiKey: 'key', fallbackEndpointUrls: ['https://a.example'] })
      expect(configure).toHaveBeenLastCalledWith(
        'key',
        pluginVersion,
        false,
        ['https://a.example'],
        false,
        5000,
        null,
        null
      )

      rerenderWithParams({ apiKey: 'key', fallbackEndpointUrls: ['https://a.example', 'https://b.example'] })

      expect(configure).toHaveBeenCalledTimes(2)
      expect(configure).toHaveBeenLastCalledWith(
        'key',
        pluginVersion,
        false,
        ['https://a.example', 'https://b.example'],
        false,
        5000,
        null,
        null
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
