import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { start } from './FingerprintClient'
import { FingerprintContext } from './FingerprintContext'
import type { GetOptions, StartOptions } from './types'
import { deepEqual } from './utils'

/**
 * Provides the {@link FingerprintContext} to its child components.
 *
 * @group Hooks approach
 *
 * @example
 * ```jsx
 * <FingerprintProvider
 *   apiKey="your-fpjs-public-api-key"
 *   region="eu"
 *   android={{ locationTimeoutMillis: 5000 }}
 * >
 *   <MyApp />
 * </FingerprintProvider>
 * ```
 */
export function FingerprintProvider({ children, ...options }: PropsWithChildren<StartOptions>) {
  // `options` is a fresh object on every render (rest spread), so we cannot depend on its identity.
  // Keep a stable reference that only changes when the options change by value. This also spares
  // consumers from having to memoize inline object props (e.g. `android`, `web`).
  const [stableOptions, setStableOptions] = useState(options)
  if (!Object.is(stableOptions, options) && !deepEqual(stableOptions, options)) {
    setStableOptions(options)
  }

  const [client, setClient] = useState(() => start(stableOptions))

  const firstRenderRef = useRef(true)
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
    } else {
      setClient(start(stableOptions))
    }
  }, [stableOptions])

  const getVisitorData = useCallback((getOptions?: GetOptions) => client.get(getOptions), [client])

  const contextValue = useMemo(() => ({ client, getVisitorData }), [client, getVisitorData])

  return <FingerprintContext.Provider value={contextValue}>{children}</FingerprintContext.Provider>
}
