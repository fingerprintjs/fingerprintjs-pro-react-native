import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FingerprintJsProAgent } from './FingerprintJsProAgent'
import { FingerprintJsProContext } from './FingerprintJsProContext'
import { FingerprintJsProAgentParams, Tags } from './types'

/**
 * Provides the FingerprintJsProContext to its child components.
 *
 * @example
 * ```jsx
 * <FingerprintJsProProvider
 *     apiKey: 'your-fpjs-public-api-key'
 *     requestOptions: { timeout: 5000 }  // Optional: Set a custom timeout in milliseconds
 * >
 *   <MyApp />
 * </FingerprintJsProProvider>
 * ```
 * @group Hooks approach
 */
export function FingerprintJsProProvider({
  children,
  ...fingerprintJsProAgentParams
}: PropsWithChildren<FingerprintJsProAgentParams>) {
  const [client, setClient] = useState<FingerprintJsProAgent>(
    () => new FingerprintJsProAgent(fingerprintJsProAgentParams)
  )
  const [visitorId, updateVisitorId] = useState('')

  const getVisitorData = useCallback(
    async (tags?: Tags, linkedId?: string) => {
      const result = await client.getVisitorData(tags, linkedId)
      updateVisitorId(result.visitorId)
      return result
    },
    [client]
  )

  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender) {
      firstRender.current = false
    } else {
      setClient(new FingerprintJsProAgent(fingerprintJsProAgentParams))
    }
  }, [fingerprintJsProAgentParams])

  const contextValue = useMemo(() => {
    return {
      visitorId,
      getVisitorData,
    }
  }, [visitorId, getVisitorData])

  return <FingerprintJsProContext.Provider value={contextValue}>{children}</FingerprintJsProContext.Provider>
}
