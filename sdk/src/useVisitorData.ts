import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FingerprintContext } from './FingerprintContext'
import { FingerprintError } from './errors'
import type { FingerprintResponse, GetOptions, QueryResult } from './types'
import { deepEqual } from './utils'

/**
 * Options for {@link useVisitorData}: the request options plus hook-specific configuration.
 *
 * @group Hooks approach
 */
export type UseVisitorDataOptions = GetOptions & {
  /**
   * Controls automatic visitor data fetching. When `true`, the hook fetches after mounting and
   * whenever the request options change.
   *
   * Defaults to `false` on React Native (unlike `@fingerprint/react`, which defaults to `true`)
   * because there is no cache on native and eager fetching increases identification costs.
   *
   * @default false
   */
  immediate?: boolean
}

/**
 * Return value of {@link useVisitorData}: the query state plus an imperative `getData`.
 *
 * @group Hooks approach
 */
export type UseVisitorDataReturn = QueryResult<FingerprintResponse> & {
  /**
   * Performs an identification request and returns the visitor data.
   * Rejects with a {@link FingerprintError} when identification fails; the error is also stored in
   * the query state.
   *
   * @param options Options for the identification request that will override the default options passed to {@link useVisitorData}.
   */
  getData: (options?: GetOptions) => Promise<FingerprintResponse>
}

const IDLE_STATE = {
  data: undefined,
  isLoading: false,
  isFetched: false,
  error: undefined,
} satisfies QueryResult<FingerprintResponse>

/**
 * Use the `useVisitorData` hook in your components to perform identification requests with the
 * Fingerprint API.
 *
 * @param options Options for the identification request that will be used by default.
 *
 * @group Hooks approach
 *
 * @example
 * ```jsx
 * const { data, isLoading, isFetched, error, getData } = useVisitorData()
 *
 * // later, e.g. in an event handler:
 * await getData({ linkedId: 'user_1234' })
 * ```
 */
export function useVisitorData(options: UseVisitorDataOptions = {}): UseVisitorDataReturn {
  const { immediate = false, ...getOptions } = options

  const { getVisitorData } = useContext(FingerprintContext)
  const [state, setState] = useState<QueryResult<FingerprintResponse>>({
    ...IDLE_STATE,
    isLoading: options.immediate || IDLE_STATE.isLoading,
  })

  // Sequence counter to guard against out-of-order responses: when several requests are in flight,
  // only the most recently initiated one is allowed to commit its result to the query state.
  const requestIdRef = useRef(0)

  // Keep a stable reference to the request options so the `immediate` effect only re-runs when they
  // change by value, not on every render.
  const [stableGetOptions, setStableGetOptions] = useState(getOptions)
  if (!Object.is(stableGetOptions, getOptions) && !deepEqual(stableGetOptions, getOptions)) {
    setStableGetOptions(getOptions)
  }

  const getData = useCallback<UseVisitorDataReturn['getData']>(
    async (requestOptions?: GetOptions) => {
      const requestId = ++requestIdRef.current
      setState({ data: undefined, isLoading: true, isFetched: false, error: undefined })
      const mergedOptions = {
        ...stableGetOptions,
        ...requestOptions,
      }
      try {
        const data = await getVisitorData(mergedOptions)
        // Ignore results from superseded requests so the latest one always wins.
        if (requestId === requestIdRef.current) {
          setState({ data, isLoading: false, isFetched: true, error: undefined })
        }
        return data
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setState({
            data: undefined,
            isLoading: false,
            isFetched: false,
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            error: error as FingerprintError,
          })
        }
        throw error
      }
    },
    [stableGetOptions, getVisitorData]
  )

  useEffect(() => {
    if (!immediate) {
      return
    }

    getData(stableGetOptions).catch(() => {
      // error is already captured in the query state
    })
    // `getData` assigns the request id synchronously, before its first `await`.
    const automaticRequestId = requestIdRef.current

    return () => {
      // A later manual `getData` call owns the query state now and must keep it, so only abandon the
      // automatic request while it is still the most recent one.
      if (requestIdRef.current !== automaticRequestId) {
        return
      }

      // Invalidate the request so its response can't overwrite the state of the newer configuration,
      // and stop reporting loading for a response that will now be ignored. When `immediate` is still
      // enabled, the next effect run re-enters loading in the same batch, so this doesn't flicker.
      requestIdRef.current++
      setState((prevState) => (prevState.isLoading ? { ...prevState, isLoading: false } : prevState))
    }
  }, [immediate, stableGetOptions, getData])

  return { ...state, getData }
}
