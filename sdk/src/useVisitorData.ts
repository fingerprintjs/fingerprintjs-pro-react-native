import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FingerprintContext } from './FingerprintContext'
import { FingerprintError, getErrorMessage, isFingerprintError } from './errors'
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

const LOADING_STATE = {
  data: undefined,
  isLoading: true,
  isFetched: false,
  error: undefined,
} satisfies QueryResult<FingerprintResponse>

function toFingerprintError(error: unknown) {
  return isFingerprintError(error)
    ? error
    : new FingerprintError({ code: 'unknown_error', message: getErrorMessage(error) })
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
  const [state, setState] = useState<QueryResult<FingerprintResponse>>(() => (immediate ? LOADING_STATE : IDLE_STATE))

  // Sequence counter to guard against out-of-order responses: when several requests are in flight,
  // only the most recently initiated one is allowed to commit its result to the query state.
  const requestIdRef = useRef(0)
  // Whether the automatic request, rather than a later manual `getData` call, owns the query state.
  // Refs can't be read during render, so this has to be state.
  const [automaticOwnsState, setAutomaticOwnsState] = useState(immediate)

  // Mirror the automatic-fetch inputs in state so the effect below only re-runs when they change by
  // value, and so the loading transition happens during render rather than inside the effect:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [currentImmediate, setCurrentImmediate] = useState(immediate)
  const [currentGetOptions, setCurrentGetOptions] = useState(getOptions)

  const didImmediateChange = currentImmediate !== immediate
  const didGetOptionsChange = !deepEqual(currentGetOptions, getOptions)

  if (didImmediateChange) {
    setCurrentImmediate(immediate)
  }

  if (didGetOptionsChange) {
    setCurrentGetOptions(getOptions)
  }

  if (immediate && (didImmediateChange || didGetOptionsChange)) {
    // The effect is about to start a request for the new inputs, so enter loading now instead of
    // exposing the previous options' data for a render.
    setState(LOADING_STATE)
    setAutomaticOwnsState(true)
  } else if (didImmediateChange && automaticOwnsState) {
    // Automatic fetching was disabled and the automatic request still owns the state; its response
    // will now be ignored, so stop reporting loading. A later manual `getData` call keeps its own
    // loading state.
    setState((prevState) => (prevState.isLoading ? IDLE_STATE : prevState))
  }

  const getData = useCallback<UseVisitorDataReturn['getData']>(
    async (requestOptions?: GetOptions) => {
      const requestId = ++requestIdRef.current
      setAutomaticOwnsState(false)

      setState((prevState) =>
        // Avoid setting loading state if it's already set.
        prevState.isLoading ? prevState : LOADING_STATE
      )

      try {
        const data = await getVisitorData({ ...currentGetOptions, ...requestOptions })

        // Ignore results from superseded requests so the latest one always wins.
        if (requestId === requestIdRef.current) {
          setState({ data, isLoading: false, isFetched: true, error: undefined })
        }

        return data
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setState({ ...IDLE_STATE, error: toFingerprintError(error) })
        }

        throw error
      }
    },
    [currentGetOptions, getVisitorData]
  )

  // `getData` isn't reused here because it sets the loading state synchronously, which isn't allowed
  // inside an effect. The loading state is covered by the initial state and the render-phase reset above.
  useEffect(() => {
    if (!currentImmediate) {
      return
    }

    const requestId = ++requestIdRef.current

    getVisitorData(currentGetOptions).then(
      (data) => {
        // Ignore results from superseded requests so the latest one always wins.
        if (requestId === requestIdRef.current) {
          setState({ data, isLoading: false, isFetched: true, error: undefined })
        }
      },
      (error: unknown) => {
        if (requestId === requestIdRef.current) {
          setState({ ...IDLE_STATE, error: toFingerprintError(error) })
        }
      }
    )

    return () => {
      // A later manual `getData` call owns the query state now and must keep it, so only abandon the
      // automatic request while it is still the most recent one. Invalidating it stops its response
      // from overwriting the state of the newer configuration.
      if (requestIdRef.current === requestId) {
        // eslint-disable-next-line @eslint-react/exhaustive-deps,react-hooks/exhaustive-deps
        requestIdRef.current++
      }
    }
  }, [currentImmediate, currentGetOptions, getVisitorData])

  return { ...state, getData }
}
