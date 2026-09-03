import { act, renderHook, waitFor } from '@testing-library/react'
import { NativeModules } from 'react-native'
import { useVisitorData } from '../src'
import { createWrapper } from './helpers'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const { getVisitorData } = NativeModules.RNFingerprintjsPro as unknown as Record<string, jest.Mock>

const nativeResponse = {
  visitorId: 'some-visitor-id',
  eventId: 'some-event-id',
  suspectScore: 42,
  sealedResult: '',
}

const expectedData = {
  visitor_id: 'some-visitor-id',
  event_id: 'some-event-id',
  suspect_score: 42,
  sealed_result: null,
}

describe('useVisitorData', () => {
  beforeEach(() => {
    getVisitorData.mockReset()
    getVisitorData.mockResolvedValue(nativeResponse)
  })

  it('starts in the idle state', () => {
    const { result } = renderHook(() => useVisitorData(), { wrapper: createWrapper() })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetched).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('transitions through loading and fetched states', async () => {
    const { result } = renderHook(() => useVisitorData(), { wrapper: createWrapper() })

    act(() => {
      void result.current.getData()
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isFetched).toBe(true)
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toStrictEqual(expectedData)
    expect(result.current.error).toBeUndefined()
  })

  it('stores the error and rejects when identification fails', async () => {
    getVisitorData.mockRejectedValueOnce(Object.assign(new Error('Rate limit reached'), { code: 'too_many_requests' }))
    const { result } = renderHook(() => useVisitorData(), { wrapper: createWrapper() })

    await act(async () => {
      await expect(result.current.getData()).rejects.toMatchObject({
        name: 'FingerprintError',
        code: 'too_many_requests',
      })
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toMatchObject({ name: 'FingerprintError', code: 'too_many_requests' })
  })

  it('passes tag, linkedId and timeout from a single options object', async () => {
    const tag = { stringTag: 'foo', numberTag: 0, objectTag: { foo: true, bar: [1, 2, 3] }, boolTag: false }
    const { result } = renderHook(() => useVisitorData(), { wrapper: createWrapper() })

    act(() => {
      void result.current.getData({ tags: tag, linkedId: 'test_id', timeout: 15_000 })
    })

    await waitFor(() => {
      expect(getVisitorData).toHaveBeenCalledWith(tag, 'test_id', 15_000)
    })
  })

  it('fetches automatically when `immediate` is true', async () => {
    const { result } = renderHook(() => useVisitorData({ immediate: true, linkedId: 'auto' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isFetched).toBe(true)
    })
    expect(getVisitorData).toHaveBeenCalledWith(null, 'auto', null)
    expect(result.current.data).toStrictEqual(expectedData)
  })

  it('re-runs automatically when the request options change while `immediate` is true', async () => {
    const { result, rerender } = renderHook(
      ({ linkedId }: { linkedId: string }) => useVisitorData({ immediate: true, linkedId }),
      { wrapper: createWrapper(), initialProps: { linkedId: 'first' } }
    )

    await waitFor(() => {
      expect(result.current.isFetched).toBe(true)
    })
    expect(getVisitorData).toHaveBeenLastCalledWith(null, 'first', null)
    expect(getVisitorData).toHaveBeenCalledTimes(1)

    rerender({ linkedId: 'second' })

    await waitFor(() => {
      expect(getVisitorData).toHaveBeenLastCalledWith(null, 'second', null)
    })
    expect(getVisitorData).toHaveBeenCalledTimes(2)
  })

  it('does not re-run when re-rendered with value-equal options but a fresh identity', async () => {
    const { rerender } = renderHook(
      ({ tag }: { tag: Record<string, unknown> }) => useVisitorData({ immediate: true, tags: tag }),
      { wrapper: createWrapper(), initialProps: { tag: { userAction: 'login' } } }
    )

    await waitFor(() => {
      expect(getVisitorData).toHaveBeenCalledTimes(1)
    })

    // Same values, brand-new object identity (as would happen with an inline prop).
    rerender({ tag: { userAction: 'login' } })

    // Give any spurious effect a chance to fire before asserting it did not.
    await Promise.resolve()
    expect(getVisitorData).toHaveBeenCalledTimes(1)
  })
})
