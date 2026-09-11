import { useContext } from 'react'
import { FingerprintContext } from './FingerprintContext'
import type { FingerprintClient } from './types'
import { FingerprintContextNotAvailableError } from './errors'

/**
 * Returns the {@link FingerprintClient} from the nearest {@link FingerprintProvider}.
 *
 * Use this when you need the imperative client from inside the React tree (e.g. in an event handler
 * or effect) but do not want the query-state management of {@link useVisitorData}.
 *
 * @group Hooks approach
 *
 * @example
 * ```ts
 * const fp = useFingerprint()
 *
 * useEffect(() => {
 *   fp.get({ linkedId: 'user_1234' }).then(setResult)
 * }, [fp])
 * ```
 */
export function useFingerprint(): FingerprintClient {
  const { client } = useContext(FingerprintContext)
  if (!client) {
    throw new FingerprintContextNotAvailableError()
  }
  return client
}
