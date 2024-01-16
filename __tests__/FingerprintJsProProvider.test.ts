import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { createWrapper, getDefaultLoadOptions } from './helpers'
import { FingerprintJsProContext } from '../src/FingerprintJsProContext'
import { NativeModules } from 'react-native'
import * as packageInfo from '../package.json'

const init = jest.fn()
const getVisitorData = jest.fn()

NativeModules.RNFingerprintjsPro = {
  init: init,
  getVisitorId: getVisitorData,
}

const pluginVersion = packageInfo.version

describe(`FingerprintJsProProvider`, () => {
  it('should pass options to agent with regular result', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://bla.bla.bla'

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.init).toHaveBeenCalledWith(
      options.apiKey,
      options.region,
      options.endpointUrl,
      false,
      pluginVersion
    )
  })

  it('should pass options to agent with extended result', () => {
    const options = getDefaultLoadOptions()
    options.region = 'us'
    options.endpointUrl = 'https://bla.bla.bla'
    options.extendedResponseFormat = true

    const wrapper = createWrapper(options)
    renderHook(() => useContext(FingerprintJsProContext), {
      wrapper,
    })

    expect(NativeModules.RNFingerprintjsPro.init).toHaveBeenCalledWith(
      options.apiKey,
      options.region,
      options.endpointUrl,
      options.extendedResponseFormat,
      pluginVersion
    )
  })
})
