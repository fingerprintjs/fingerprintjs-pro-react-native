import { act, renderHook, waitFor } from '@testing-library/react'
import { NativeModules } from 'react-native'
import { RequestOptions, useVisitorData } from '../src'
import { createWrapper } from './helpers'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const { getVisitorData, getVisitorDataWithTimeout } = NativeModules.RNFingerprintjsPro as unknown as Record<
  string,
  jest.Mock
>

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
      void result.current.getData()
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
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )
    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      void result.current.getData()
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

  it('should store errors and return null by default', async () => {
    const error = new Error('Unknown error')
    getVisitorData.mockReturnValueOnce(Promise.reject(error))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })

    await act(async () => {
      await expect(result.current.getData()).resolves.toBeNull()
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.name).toBe('UnknownError')
    expect(result.current.error?.message).toContain(error.message)
  })

  it('should rethrow errors when throwOnError is enabled', async () => {
    const error = new Error('Unknown error')
    getVisitorData.mockReturnValueOnce(Promise.reject(error))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })

    await act(async () => {
      await expect(result.current.getData(undefined, undefined, { throwOnError: true })).rejects.toMatchObject({
        name: 'UnknownError',
        message: error.message,
      })
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toMatchObject({
      name: 'UnknownError',
      message: error.message,
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
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      void result.current.getData(mockedTags, mockedLinkedId)
    })
    await waitFor(() => {
      expect(getVisitorData).toHaveBeenCalledWith(mockedTags, mockedLinkedId)
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
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      void result.current.getData(mockedTags, mockedLinkedId, options)
    })
    await waitFor(() => {
      expect(getVisitorData).toHaveBeenCalledWith(mockedTags, mockedLinkedId)
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
      Promise.resolve({
        requestId: mockedRequestId,
        confidenceScore: mockedConfidenceScore,
        visitorDataJson: JSON.stringify(mockedJsonAnswer),
      })
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData(), { wrapper })
    act(() => {
      void result.current.getData(mockedTags, mockedLinkedId, options)
    })
    await waitFor(() => {
      expect(getVisitorDataWithTimeout).toHaveBeenCalledWith(mockedTags, mockedLinkedId, options.timeout)
    })
  })
})
