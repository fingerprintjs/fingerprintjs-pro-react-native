import { FingerprintError } from './errors'

/**
 * Native implementation.
 *
 * The native modules reject the promise with a structured error: React Native surfaces the rejection
 * `code` as `error.code`, the message as `error.message`, and any extra data (here, the server
 * `eventId`) under `error.userInfo`. We map that straight onto a {@link FingerprintError} — no string
 * encoding involved. Anything that doesn't carry a `code` falls back to `unknown_error`.
 */
export function unwrapError(error: unknown): FingerprintError {
  if (error instanceof FingerprintError) {
    return error
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = error.code
    if (typeof code === 'string' && code.length > 0) {
      const message = 'message' in error && typeof error.message === 'string' ? error.message : undefined
      return new FingerprintError({ code, message, event_id: readEventId(error) })
    }
  }

  if (error instanceof Error) {
    return new FingerprintError({ code: 'unknown_error', message: error.message })
  }

  return new FingerprintError({ code: 'unknown_error', message: String(error) })
}

/** Extracts the optional server event id React Native nests under `error.userInfo.eventId`. */
function readEventId(error: object): string | null {
  if (!('userInfo' in error)) {
    return null
  }

  const userInfo = error.userInfo
  if (typeof userInfo === 'object' && userInfo !== null && 'eventId' in userInfo) {
    const eventId = userInfo.eventId
    if (typeof eventId === 'string') {
      return eventId
    }
  }

  return null
}
