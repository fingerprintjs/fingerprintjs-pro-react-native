import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FingerprintJsProAgent } from './FingerprintJsProAgent'
import { FingerprintJsProContext } from './FingerprintJsProContext'
import { Region, Tags } from './types'

export interface FingerprintJsProProviderOptions {
  apiKey: string
  region?: Region
  endpointUrl?: string
  extendedResponseFormat?: boolean
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
 * @param extendedResponseFormat set this flag to get response in extended format
 */
export function FingerprintJsProProvider({
  children,
  apiKey,
  region,
  endpointUrl,
  extendedResponseFormat,
}: PropsWithChildren<FingerprintJsProProviderOptions>) {
  const [client, setClient] = useState<FingerprintJsProAgent>(
    () => new FingerprintJsProAgent(apiKey, region, endpointUrl, extendedResponseFormat)
  )
  const [visitorId, updateVisitorId] = useState('')

  const getVisitorData = useCallback(
    async (tags?: Tags, linkedId?: String) => {
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
      setClient(new FingerprintJsProAgent(apiKey, region, endpointUrl, extendedResponseFormat))
    }
  }, [apiKey, region, endpointUrl, extendedResponseFormat])

  const contextValue = useMemo(() => {
    return {
      visitorId,
      getVisitorData,
    }
  }, [visitorId, getVisitorData])

  return <FingerprintJsProContext.Provider value={contextValue}>{children}</FingerprintJsProContext.Provider>
}
