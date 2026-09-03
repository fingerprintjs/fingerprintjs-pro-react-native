export class FingerprintContextNotAvailableError extends Error {
  constructor() {
    super('FingerprintContext not available. Did you forget to wrap your component in <FingerprintProvider>?')
  }
}

/**
 * The known values of {@link FingerprintError.code}, shared across web, iOS, and Android.
 *
 * The list is not exhaustive: a newer native SDK or the web agent may emit a code not yet included
 * here, so {@link FingerprintError.code} accepts any string. This union exists to give editor
 * autocomplete for the common cases (e.g. in `error.code === '...'` checks).
 *
 * @group Errors
 */
export type ErrorCode =
  // Server / API v4 errors (emitted on every platform)
  | 'failed'
  | 'request_cannot_be_parsed'
  | 'request_read_timeout'
  | 'request_timeout'
  | 'request_not_found'
  | 'response_cannot_be_parsed'
  | 'too_many_requests'
  | 'secret_api_key_required'
  | 'secret_api_key_not_found'
  | 'public_api_key_required'
  | 'public_api_key_not_found'
  | 'subscription_not_active'
  | 'subscription_not_found'
  | 'subscription_restricted'
  | 'wrong_region'
  | 'feature_not_enabled'
  | 'visitor_not_found'
  | 'state_not_ready'
  | 'event_not_found'
  | 'missing_module'
  | 'payload_too_large'
  | 'service_unavailable'
  | 'ruleset_not_found'
  | 'environment_restricted'
  | 'installation_method_restricted'
  | 'invalid_proxy_integration_secret'
  | 'invalid_proxy_integration_headers'
  | 'proxy_integration_secret_environment_mismatch'
  | 'sandboxed_iframe'
  // Client-side errors — native (iOS / Android)
  | 'invalid_url'
  | 'invalid_url_params'
  | 'network_error'
  | 'network_unavailable'
  | 'json_parsing_error'
  | 'invalid_response_type'
  | 'client_timeout'
  | 'unknown_error'
  // Client-side errors — web (`@fingerprint/agent`)
  | 'network_connection'
  | 'network_abort'
  | 'csp_block'
  | 'invalid_endpoint'
  | 'handle_agent_data'
  | 'script_load_fail'
  | 'bundle_not_defined'
  | 'bad_response_format'
  | 'server_error'
  | 'api_key_missing'
  | 'api_key_invalid'
  | 'cache_misconfigured'
  | 'endpoints_misconfigured'
  | 'wrong_worker_option'
  | 'worker_initialization_failed'

// `string & {}` keeps TypeScript from widening the union back to `string`, so known codes stay
// available for autocomplete while any other string remains assignable.
type FingerprintErrorCode = ErrorCode | (string & {})

/**
 * The single error type thrown by the SDK on every platform.
 *
 * It mirrors the error of `@fingerprint/agent`: a machine-friendly {@link FingerprintError.code}
 * plus a resolution-oriented `message`.
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
   * A machine-friendly code for the type of this error, e.g. `too_many_requests`. Known values are
   * listed in {@link ErrorCode}; any other string is still possible (see that type's note).
   */
  public readonly code: FingerprintErrorCode

  /**
   * A unique id to refer to the error. Available only for errors that originate on the server side,
   * otherwise `null`.
   */
  public readonly event_id: string | null

  constructor({ code, message, event_id }: { code: FingerprintErrorCode; message?: string; event_id?: string | null }) {
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
  return error instanceof FingerprintError
}
