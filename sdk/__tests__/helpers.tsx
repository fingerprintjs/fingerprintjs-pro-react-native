import React, { PropsWithChildren } from 'react'
import { FingerprintJsProProvider, FingerprintJsProAgentParams } from '../src'

export const getDefaultLoadOptions = (): FingerprintJsProAgentParams => ({
  apiKey: 'test_api_key',
})

export const createWrapper =
  (loadOptions: FingerprintJsProAgentParams = getDefaultLoadOptions()) =>
  ({ children }: PropsWithChildren<{}>): JSX.Element =>
    <FingerprintJsProProvider {...loadOptions}>{children}</FingerprintJsProProvider>
