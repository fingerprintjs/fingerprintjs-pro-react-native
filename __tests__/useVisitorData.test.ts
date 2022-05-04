import { act, renderHook } from '@testing-library/react-hooks'
import { NativeModules } from 'react-native'
import { useVisitorData } from '../src'
import { createWrapper } from './helpers'

const init = jest.fn()
const getVisitorData = jest.fn()

NativeModules.RNFingerprintjsPro = {
  init: init,
  getVisitorId: getVisitorData,
}

describe('useVisitorData', () => {
  it('should provide FingerprintJsProContext', () => {
    const wrapper = createWrapper()
    const {
      result: { current },
    } = renderHook(() => useVisitorData(), { wrapper })
    expect(current).toBeDefined()
  })

  it('should correct update isLoading state', async () => {
    const wrapper = createWrapper()
    const { result, waitForNextUpdate } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData()
    })
    expect(result.current.isLoading).toBeTruthy()
    await waitForNextUpdate()
    expect(result.current.isLoading).toBeFalsy()
  })

  it('should correct return data', async () => {
    const mockedVisitorId = 'some visitor id'
    getVisitorData.mockReturnValueOnce(Promise.resolve(mockedVisitorId))
    const wrapper = createWrapper()
    const { result, waitForNextUpdate } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData()
    })
    expect(result.current.data).toBeUndefined()
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual({ visitorId: mockedVisitorId })
    expect(result.current.error).toBeFalsy()
  })

  it('should fill error field in case of error', async () => {
    const error = new Error('Unknown error')
    getVisitorData.mockReturnValueOnce(Promise.reject(error))
    const wrapper = createWrapper()
    const { result, waitForNextUpdate } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData()
    })
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.error).toBeFalsy()
    await waitForNextUpdate()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.name).toBe('FingerprintJsProAgentError')
    expect(result.current.error?.message).toContain(error.message)
  })
})
