export class FingerprintContextNotAvailableError extends Error {
  constructor() {
    super('FingerprintContext not available. Did you forget to wrap your component in <FingerprintProvider>?')
  }
}

/**
 * The single error type thrown by the SDK on every platform.
 *
 * It mirrors the error of `@fingerprint/agent`: a machine-friendly {@link FingerprintError.code}
 * plus a resolution-oriented `message`. This replaces the ~30 error classes exported in v3.
 *
 * @group Errors
 *
 * @example
 * ```ts
 * try {
 *   await client.get()
 * } catch (error) {
 *   if (isFingerprintError(error) && error.code === 'too_many_requests') {
 *     // handle rate limiting
 *   }
 * }
 * ```
 */
export class FingerprintError extends Error {
  public readonly name = 'FingerprintError'

  /**
   * A machine-friendly code for the type of this error, e.g. `too_many_requests`.
   */
  public readonly code: string

  /**
   * A unique id to refer to the error. Available only for errors that originate on the server side,
   * otherwise `null`.
   */
  public readonly event_id: string | null

  constructor({ code, message, event_id }: { code: string; message?: string; event_id?: string | null }) {
    super(message)
    this.code = code
    this.event_id = event_id ?? null
    // Restore the prototype chain so `instanceof` works after transpilation to ES5-era targets.
    Object.setPrototypeOf(this, FingerprintError.prototype)
  }
}

/**
 * Type guard to check whether an error is a {@link FingerprintError}.
 *
 * @group Errors
 */
export function isFingerprintError(error: unknown): error is FingerprintError {
  return error instanceof FingerprintError || (error instanceof Error && error.name === 'FingerprintError')
}
