import { useCallback, useState } from 'react'
import { getOptionsCacheKey } from './getOptionsCacheKey'
import { FingerprintResponse } from './types'
import { UseVisitorDataOptions } from './useVisitorData'

export type UsePromiseStoreReturn = {
  /**
   *  Accepts a callback that returns a promise (`requestCallback`)
   *   and optional parameters (`options`). Ensures that the same request identified by a cache key is
   *   only executed once at a time, and returns the stored promise for the request. The promise is
   *   removed from the store once it is resolved or rejected.
   * */
  doRequest: (
    requestCallback: () => Promise<FingerprintResponse>,
    options?: UseVisitorDataOptions
  ) => Promise<FingerprintResponse>
}

/**
 * Manages a store of promises to handle unique asynchronous requests, ensuring that
 * requests with the same key are not duplicated while they are still pending.
 */
export function usePromiseStore(): UsePromiseStoreReturn {
  const [store] = useState(() => new Map<string, Promise<FingerprintResponse>>())

  const doRequest = useCallback(
    (requestCallback: () => Promise<FingerprintResponse>, options?: UseVisitorDataOptions) => {
      const cacheKey = getOptionsCacheKey(options)
      let cachedPromise = store.get(cacheKey)

      if (!cachedPromise) {
        cachedPromise = requestCallback().finally(() => {
          store.delete(cacheKey)
        })

        store.set(cacheKey, cachedPromise)
      }

      return cachedPromise
    },
    [store]
  )

  return {
    doRequest,
  }
}
