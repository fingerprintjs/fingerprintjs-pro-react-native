import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { createWrapper, getDefaultLoadOptions } from './helpers'
import { FingerprintJsProContext } from '../src/FingerprintJsProContext'
import { NativeModules } from 'react-native'
import * as packageInfo from '../package.json'
import { FingerprintJsProAgent } from '../src'

const init = jest.fn()
const getVisitorId = jest.fn()
const getVisitorData = jest.fn()
const getVisitorIdWithTimeout = jest.fn()
const getVisitorDataWithTimeout = jest.fn()

NativeModules.RNFingerprintjsPro = {
  init: init,
  getVisitorId: getVisitorId,
  getVisitorIdWithTimeout: getVisitorIdWithTimeout,
  getVisitorData: getVisitorData,
  getVisitorDataWithTimeout: getVisitorDataWithTimeout,
}

const mockedVisitorId = 'some visitor id'
const mockedRequestId = 'some request id'
const mockedConfidenceScore = 0.99

const pluginVersion = packageInfo.version

describe(`FingerprintJsProProvider`, () => {
  it('should pass options to agent with regular result', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://example.com'

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.init).toHaveBeenCalledWith(
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

    expect(NativeModules.RNFingerprintjsPro.init).toHaveBeenCalledWith(
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

    expect(NativeModules.RNFingerprintjsPro.init).toHaveBeenCalledWith(
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

    expect(NativeModules.RNFingerprintjsPro.getVisitorDataWithTimeout).toHaveBeenCalledWith(undefined, undefined, 5_000)
  })
})
