import { act, renderHook, waitFor } from '@testing-library/react'
import { NativeModules } from 'react-native'
import { RequestOptions, useVisitorData } from '../src'
import { createWrapper } from './helpers'

const init = jest.fn()
const getVisitorId = jest.fn()
const getVisitorData = jest.fn()
const getVisitorDataWithTimeout = jest.fn()

NativeModules.RNFingerprintjsPro = {
  init: init,
  getVisitorId: getVisitorId,
  getVisitorData: getVisitorData,
  getVisitorDataWithTimeout: getVisitorDataWithTimeout,
}

const mockedVisitorId = 'some visitor id'
const mockedRequestId = 'some request id'
const mockedConfidenceScore = 0.99

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
    const { result } = renderHook(() => useVisitorData(), { wrapper })

    act(() => {
      result.current.getData()
    })

    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
    })
  })

  it('should correct return data', async () => {
    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }

    getVisitorData.mockReturnValueOnce(
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )
    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData()
    })
    expect(result.current.data).toBeUndefined()
    await waitFor(() => {
      expect(result.current.data).toStrictEqual({
        visitorId: mockedVisitorId,
        requestId: mockedRequestId,
        confidence: {
          score: mockedConfidenceScore,
        },
      })
      expect(result.current.error).toBeFalsy()
    })
  })

  it('should fill error field in case of error', async () => {
    const error = new Error('Unknown error')
    getVisitorData.mockReturnValueOnce(Promise.reject(error))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData()
    })
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.error).toBeFalsy()
    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.name).toBe('UnknownError')
      expect(result.current.error?.message).toContain(error.message)
    })
  })

  it('should pass linkedId and tags to `getData` function', async () => {
    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }

    const mockedTags = {
      stringTag: 'foo',
      numberTag: 0,
      ObjectTag: {
        foo: true,
        bar: [1, 2, 3],
      },
      boolTag: false,
    }

    const mockedLinkedId = 'test_id'

    getVisitorData.mockReturnValueOnce(
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData(mockedTags, mockedLinkedId)
    })
    await waitFor(() => {
      expect(getVisitorData).toBeCalledWith(mockedTags, mockedLinkedId)
    })
  })

  it('options object with empty timeout should call `getVisitorData` function', async () => {
    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }

    const mockedTags = {
      stringTag: 'foo',
      numberTag: 0,
      ObjectTag: {
        foo: true,
        bar: [1, 2, 3],
      },
      boolTag: false,
    }

    const mockedLinkedId = 'test_id'

    const options: RequestOptions = { timeout: undefined }

    getVisitorData.mockReturnValueOnce(
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData(mockedTags, mockedLinkedId, options)
    })
    await waitFor(() => {
      expect(getVisitorData).toBeCalledWith(mockedTags, mockedLinkedId)
    })
  })

  it('non-empty timeout should call `getVisitorDataWithTimeout` function', async () => {
    const mockedJsonAnswer = {
      visitorId: mockedVisitorId,
    }

    const mockedTags = {
      stringTag: 'foo',
      numberTag: 0,
      ObjectTag: {
        foo: true,
        bar: [1, 2, 3],
      },
      boolTag: false,
    }

    const mockedLinkedId = 'test_id'

    const options: RequestOptions = { timeout: 15_000 }

    getVisitorDataWithTimeout.mockReturnValueOnce(
      Promise.resolve([mockedRequestId, mockedConfidenceScore, JSON.stringify(mockedJsonAnswer)])
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      result.current.getData(mockedTags, mockedLinkedId, options)
    })
    await waitFor(() => {
      expect(getVisitorDataWithTimeout).toBeCalledWith(mockedTags, mockedLinkedId, options.timeout)
    })
  })
})
