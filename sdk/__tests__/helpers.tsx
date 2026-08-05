import React, { PropsWithChildren } from 'react'
import { render, RenderResult } from '@testing-library/react'
import { FingerprintJsProAgentParams, FingerprintJsProProvider } from '../src'

export const getDefaultLoadOptions = (): FingerprintJsProAgentParams => ({
  apiKey: 'test_api_key',
})

export const createWrapper =
  (loadOptions: FingerprintJsProAgentParams = getDefaultLoadOptions()) =>
  ({ children }: PropsWithChildren) => <FingerprintJsProProvider {...loadOptions}>{children}</FingerprintJsProProvider>

/**
 * Renders the provider with the given params and exposes a typed `rerenderWithParams` helper so tests
 * can change `fingerprintJsProAgentParams` across renders without inlining JSX.
 */
export const renderProvider = (
  params: FingerprintJsProAgentParams
): RenderResult & {
  rerenderWithParams: (nextParams: FingerprintJsProAgentParams) => void
} => {
  const utils = render(<FingerprintJsProProvider {...params} />)

  return {
    ...utils,
    rerenderWithParams: (nextParams: FingerprintJsProAgentParams) => {
      utils.rerender(<FingerprintJsProProvider {...nextParams} />)
    },
  }
}
