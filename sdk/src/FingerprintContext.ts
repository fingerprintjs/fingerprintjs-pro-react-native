import { createContext } from 'react'
import type { FingerprintClient, FingerprintResponse, GetOptions } from './types'
import { FingerprintContextNotAvailableError } from './errors'

const stub = (): never => {
  throw new FingerprintContextNotAvailableError()
}

/**
 * The Fingerprint context.
 *
 * @group Hooks approach
 */
export interface FingerprintContextInterface {
  /**
   * The imperative client. `undefined` until a {@link FingerprintProvider} is mounted.
   */
  client: FingerprintClient | undefined
  /**
   * Performs an identification request using the provider's client.
   */
  getVisitorData: (options?: GetOptions) => Promise<FingerprintResponse>
}

export const FingerprintContext = createContext<FingerprintContextInterface>({
  client: undefined,
  getVisitorData: stub,
})
