import { useContext } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { createWrapper, getDefaultLoadOptions } from './helpers';
import {FingerprintJsProContext} from '../src/FingerprintJsProContext';
import { NativeModules } from 'react-native';

const init = jest.fn()
const getVisitorData = jest.fn()

NativeModules.RNFingerprintjsPro = {
    init: init,
    getVisitorId: getVisitorData,
}

describe(`FingerprintJsProProvider`, () => {
    it('should pass options to agent', () => {
        const options = getDefaultLoadOptions()
        options.region = 'us'
        options.endpointUrl = 'https://bla.bla.bla'

        const wrapper = createWrapper(options)
        renderHook(() => useContext(FingerprintJsProContext), {
            wrapper,
        })

        expect(NativeModules.RNFingerprintjsPro.init).toHaveBeenCalledWith(options.apiKey, options.region, options.endpointUrl)
    })
})