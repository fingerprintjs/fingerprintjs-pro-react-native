import { FingerprintError } from './errors'

/**
 * Native implementation.
 *
 * The native modules reject with a message in the form `"<code>:<message>"`, where `<code>` is the
 * API v4 error code (e.g. `too_many_requests`). Server-originated errors additionally carry the
 * event ID in the prefix, as `"<code>|<eventId>:<message>"`. Error codes never contain `|`, so both
 * forms can be split back into a {@link FingerprintError} unambiguously.
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

    const [rawCode, ...rawEventId] = error.message.slice(0, separatorIndex).split('|')
    const code = rawCode.trim()
    const eventId = rawEventId.join('|').trim()
    const message = error.message.slice(separatorIndex + 1).trim()
    return new FingerprintError({
      code: code || 'unknown_error',
      message: message || error.message,
      event_id: eventId || null,
    })
  }

  return new FingerprintError({ code: 'unknown_error', message: String(error) })
}
