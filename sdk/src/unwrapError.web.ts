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
    return new FingerprintError({ code: error.code, message: error.message, event_id: error.event_id })
  }

  if (error instanceof Error) {
    return new FingerprintError({ code: 'unknown_error', message: error.message })
  }

  return new FingerprintError({ code: 'unknown_error', message: String(error) })
}
