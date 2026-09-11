import React, { PropsWithChildren } from 'react'
import { render, RenderResult } from '@testing-library/react'
import { FingerprintProvider, StartOptions } from '../src'

export const getDefaultLoadOptions = (): StartOptions => ({
  apiKey: 'test_api_key',
})

export const createWrapper =
  (loadOptions: StartOptions = getDefaultLoadOptions()) =>
  ({ children }: PropsWithChildren) => <FingerprintProvider {...loadOptions}>{children}</FingerprintProvider>

/**
 * Renders the provider with the given options and exposes a typed `rerenderWithParams` helper so tests
 * can change the start options across renders without inlining JSX.
 */
export const renderProvider = (
  params: StartOptions
): RenderResult & {
  rerenderWithParams: (nextParams: StartOptions) => void
} => {
  const utils = render(<FingerprintProvider {...params} />)

  return {
    ...utils,
    rerenderWithParams: (nextParams: StartOptions) => {
      utils.rerender(<FingerprintProvider {...nextParams} />)
    },
  }
}
