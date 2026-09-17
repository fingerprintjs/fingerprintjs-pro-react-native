import { FingerprintError } from './errors'
import { isFingerprintError } from '@fingerprint/agent'

/**
 * Web implementation.
 *
 * `@fingerprint/agent` already throws its own `FingerprintError` (structurally identical to ours).
 * We re-wrap it in the SDK's {@link FingerprintError} so `instanceof` checks work against a single
 * class regardless of platform.
 */
export function unwrapError(error: unknown): FingerprintError {
  if (error instanceof FingerprintError) {
    return error
  }

  if (isFingerprintError(error)) {
    return new FingerprintError({ code: normalizeCode(error.code), message: error.message, event_id: error.event_id })
  }

  if (error instanceof Error) {
    return new FingerprintError({ code: 'unknown_error', message: error.message })
  }

  return new FingerprintError({ code: 'unknown_error', message: String(error) })
}

/**
 * The agent splits network failures into `network_connection` and `network_abort`; the native
 * clients report a single `network_error`. Collapse both into `network_error` so the code is the
 * same on every platform.
 */
function normalizeCode(code: string) {
  return code === 'network_connection' || code === 'network_abort' ? 'network_error' : code
}
