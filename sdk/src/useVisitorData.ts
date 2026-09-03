import { useCallback, useContext, useEffect, useState } from 'react'
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

const IDLE_STATE: QueryResult<FingerprintResponse> = {
  data: undefined,
  isLoading: false,
  isFetched: false,
  error: undefined,
}

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
  const [state, setState] = useState<QueryResult<FingerprintResponse>>(IDLE_STATE)

  // Keep a stable reference to the request options so the `immediate` effect only re-runs when they
  // change by value, not on every render.
  const [stableGetOptions, setStableGetOptions] = useState(getOptions)
  if (!Object.is(stableGetOptions, getOptions) && !deepEqual(stableGetOptions, getOptions)) {
    setStableGetOptions(getOptions)
  }

  const getData = useCallback<UseVisitorDataReturn['getData']>(
    async (requestOptions?: GetOptions) => {
      setState({ data: undefined, isLoading: true, isFetched: false, error: undefined })
      const mergedOptions = {
        ...stableGetOptions,
        ...requestOptions,
      }
      try {
        const data = await getVisitorData(mergedOptions)
        setState({ data, isLoading: false, isFetched: true, error: undefined })
        return data
      } catch (error) {
        setState({
          data: undefined,
          isLoading: false,
          isFetched: false,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          error: error as FingerprintError,
        })
        throw error
      }
    },
    [stableGetOptions, getVisitorData]
  )

  useEffect(() => {
    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      getData(stableGetOptions).catch(() => {
        // error is already captured in the query state
      })
    }
  }, [immediate, stableGetOptions, getData])

  return { ...state, getData }
}
