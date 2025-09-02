import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { createWrapper, getDefaultLoadOptions } from './helpers'
import { FingerprintJsProContext } from '../src/FingerprintJsProContext'
import { NativeModules } from 'react-native'
import * as packageInfo from '../package.json'
import { FingerprintJsProAgent } from '../src'

const configure = jest.fn()
const getVisitorId = jest.fn()
const getVisitorData = jest.fn()
const getVisitorIdWithTimeout = jest.fn()
const getVisitorDataWithTimeout = jest.fn()

NativeModules.RNFingerprintjsPro = {
  configure: configure,
  getVisitorId: getVisitorId,
  getVisitorIdWithTimeout: getVisitorIdWithTimeout,
  getVisitorData: getVisitorData,
  getVisitorDataWithTimeout: getVisitorDataWithTimeout,
}

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
      pluginVersion
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
      pluginVersion
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
      pluginVersion
    )
  })

  it('should call `getVisitorId` function when there is no timeout', () => {
    const options = getDefaultLoadOptions()
    const fingerprintClient = new FingerprintJsProAgent(options)
    fingerprintClient.getVisitorId()

    expect(NativeModules.RNFingerprintjsPro.getVisitorId).toHaveBeenCalledWith(undefined, undefined)
  })

  it('should pass timeout to `getVisitorIdWithTimeout` function', () => {
    const options = getDefaultLoadOptions()
    options.requestOptions = { timeout: 18_000 }
    const fingerprintClient = new FingerprintJsProAgent(options)
    fingerprintClient.getVisitorId()

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
    fingerprintClient.getVisitorId()

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
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    fingerprintClient.getVisitorId(undefined, undefined, { timeout: getRequestTimeout })

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
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    fingerprintClient.getVisitorData()

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
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    fingerprintClient.getVisitorData()

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
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    fingerprintClient.getVisitorData()

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
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    fingerprintClient.getVisitorData(undefined, undefined, { timeout: getRequestTimeout })

    expect(NativeModules.RNFingerprintjsPro.getVisitorDataWithTimeout).toHaveBeenCalledWith(
      undefined,
      undefined,
      getRequestTimeout
    )
  })
})
