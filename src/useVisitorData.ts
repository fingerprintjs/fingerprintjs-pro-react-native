import { useCallback, useContext, useState } from 'react'
import { FingerprintJsProContextInterface, FingerprintJsProContext } from './FingerprintJsProContext'
import { QueryResult, VisitorQueryContext, VisitorData } from './types'

/**
 * Use the `useVisitorData` hook in your components to perform identification requests with the FingerprintJS API.
 *
 * @example
 * ```jsx
 * const {
 *   // Request state
 *   isLoading,
 *   // Error info
 *   error,
 *   // Visitor info
 *   data,
 *   // A method to be called to initiate request
 *   getData,
 * } = useVisitorData();
 * ```
 *
 * @group Hooks approach
 */
export function useVisitorData(): VisitorQueryContext {
  const { getVisitorData } = useContext<FingerprintJsProContextInterface>(FingerprintJsProContext)
  const [state, setState] = useState<QueryResult<VisitorData>>({})

  const getData = useCallback<VisitorQueryContext['getData']>(
    async (tags, linkedId) => {
      let result: VisitorData | null = null
      try {
        setState((state) => ({ ...state, isLoading: true }))
        result = await getVisitorData(tags, linkedId)
        setState((state) => ({
          ...state,
          data: result as VisitorData,
          isLoading: false,
          error: undefined,
        }))
      } catch (error) {
        if (error instanceof Error) {
          error.message = `${error.name}: ${error.message}`
          error.name = 'FingerprintJsProAgentError'
          setState((state) => ({
            ...state,
            data: undefined,
            error: error as Error,
          }))
        }
      } finally {
        setState((state) => (state.isLoading ? { ...state, isLoading: false } : state))
      }
      return result
    },
    [getVisitorData]
  )

  const { isLoading, data, error } = state

  return {
    isLoading,
    data,
    error,
    getData,
  }
}
