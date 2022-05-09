import React, { PropsWithChildren } from 'react'
import { FingerprintJsProProvider } from '../src'
import { FingerprintJsProProviderOptions } from '../src/FingerprintJsProProvider'

export const getDefaultLoadOptions = (): FingerprintJsProProviderOptions => ({
  apiKey: 'test_api_key',
})

export const createWrapper =
  (loadOptions: FingerprintJsProProviderOptions = getDefaultLoadOptions()) =>
  ({ children }: PropsWithChildren<{}>): JSX.Element =>
    <FingerprintJsProProvider {...loadOptions}>{children}</FingerprintJsProProvider>
