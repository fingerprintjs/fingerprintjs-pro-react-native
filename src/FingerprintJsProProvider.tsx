import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FingerprintJsProAgent } from './FingerprintJsProAgent'
import { FingerprintJsProContext } from './FingerprintJsProContext'
import { Region } from './types'

export interface FingerprintJsProProviderOptions {
  apiKey: string
  region?: Region
  endpointUrl?: string
}

/**
 * ```jsx
 * <FingerprintJsProProvider
 *     apiKey: 'your-fpjs-public-api-key'
 * >
 *   <MyApp />
 * </FingerprintJsProProvider>
 * ```
 *
 * Provides the FingerprintJsProContext to its child components.
 *
 * @param apiKey your public API key that authenticates the agent with the API
 * @param region which region to use
 * @param endpointUrl server API URL, should be only used with Subdomain integration
 */
export function FingerprintJsProProvider({
  children,
  apiKey,
  region,
  endpointUrl,
}: PropsWithChildren<FingerprintJsProProviderOptions>) {
  const [client, setClient] = useState<FingerprintJsProAgent>(
    () => new FingerprintJsProAgent(apiKey, region, endpointUrl)
  )
  const [visitorId, updateVisitorId] = useState('')

  const getVisitorData = useCallback(async () => {
    const result = await client.getVisitorId()
    updateVisitorId(result)
    return result
  }, [client])

  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender) {
      firstRender.current = false
    } else {
      setClient(new FingerprintJsProAgent(apiKey, region, endpointUrl))
    }
  }, [apiKey, region, endpointUrl])

  const contextValue = useMemo(() => {
    return {
      visitorId,
      getVisitorData,
    }
  }, [visitorId, getVisitorData])

  return <FingerprintJsProContext.Provider value={contextValue}>{children}</FingerprintJsProContext.Provider>
}
