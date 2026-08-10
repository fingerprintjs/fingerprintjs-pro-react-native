import { FingerprintError } from './errors'

/**
 * Native implementation.
 *
 * The native modules reject with a message in the form `"<code>:<message>"`, where `<code>` is the
 * API v4 error code (e.g. `too_many_requests`). We split it back into a {@link FingerprintError}.
 */
export function unwrapError(error: unknown): FingerprintError {
  if (error instanceof FingerprintError) {
    return error
  }

  if (error instanceof Error) {
    const separatorIndex = error.message.indexOf(':')
    if (separatorIndex === -1) {
      return new FingerprintError({ code: 'unknown_error', message: error.message })
    }

    const code = error.message.slice(0, separatorIndex).trim()
    const message = error.message.slice(separatorIndex + 1).trim()
    return new FingerprintError({ code: code || 'unknown_error', message: message || error.message })
  }

  return new FingerprintError({ code: 'unknown_error', message: String(error) })
}
