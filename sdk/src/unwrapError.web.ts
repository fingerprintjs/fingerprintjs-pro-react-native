import {
  ApiKeyExpiredError,
  ApiKeyNotFoundError,
  ApiKeyRequiredError,
  ClientTimeoutError,
  FailedError,
  HeaderRestrictedError,
  HostnameRestrictedError,
  IdentificationError,
  InstallationMethodRestrictedError,
  InvalidProxyIntegrationHeadersError,
  InvalidProxyIntegrationSecretError,
  NetworkError,
  OriginNotAvailableError,
  ProxyIntegrationSecretEnvironmentMismatch,
  RequestCannotBeParsedError,
  RequestTimeoutError,
  ResponseCannotBeParsedError,
  SubscriptionNotActiveError,
  TooManyRequestError,
  UnknownError,
  UnsupportedVersionError,
  WrongRegionError,
} from './errors'
import { FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-spa'

/**
 * Web implementation for error handling. Note: not all errors from native SDK are available on the web.
 *
 * @platform web
 * */
export function unwrapError(error: Error): IdentificationError {
  switch (error.message) {
    // Api Errors block
    case FingerprintJSPro.ERROR_API_KEY_MISSING:
      return new ApiKeyRequiredError(error.message)

    case FingerprintJSPro.ERROR_API_KEY_INVALID:
      return new ApiKeyNotFoundError(error.message)

    case FingerprintJSPro.ERROR_API_KEY_EXPIRED:
      return new ApiKeyExpiredError(error.message)

    case FingerprintJSPro.ERROR_BAD_REQUEST_FORMAT:
      return new RequestCannotBeParsedError(error.message)

    case FingerprintJSPro.ERROR_GENERAL_SERVER_FAILURE:
      return new FailedError(error.message)

    case FingerprintJSPro.ERROR_SERVER_TIMEOUT:
      return new RequestTimeoutError(error.message)

    case FingerprintJSPro.ERROR_RATE_LIMIT:
      return new TooManyRequestError(error.message)

    case FingerprintJSPro.ERROR_FORBIDDEN_ORIGIN:
      return new OriginNotAvailableError(error.message)

    case FingerprintJSPro.ERROR_FORBIDDEN_HEADER:
      return new HeaderRestrictedError(error.message)

    case FingerprintJSPro.ERROR_FORBIDDEN_ENDPOINT:
      return new HostnameRestrictedError(error.message)

    case FingerprintJSPro.ERROR_WRONG_REGION:
      return new WrongRegionError(error.message)

    case FingerprintJSPro.ERROR_SUBSCRIPTION_NOT_ACTIVE:
      return new SubscriptionNotActiveError(error.message)

    case FingerprintJSPro.ERROR_UNSUPPORTED_VERSION:
      return new UnsupportedVersionError(error.message)

    case FingerprintJSPro.ERROR_INSTALLATION_METHOD_RESTRICTED:
      return new InstallationMethodRestrictedError(error.message)

    case FingerprintJSPro.ERROR_BAD_RESPONSE_FORMAT:
      return new ResponseCannotBeParsedError(error.message)

    // end of API Errors block
    case FingerprintJSPro.ERROR_CLIENT_TIMEOUT:
      return new ClientTimeoutError(error.message)

    case FingerprintJSPro.ERROR_NETWORK_CONNECTION:
    case FingerprintJSPro.ERROR_NETWORK_ABORT:
    case FingerprintJSPro.ERROR_NETWORK_RESTRICTED:
      return new NetworkError(error.message)

    case FingerprintJSPro.ERROR_INVALID_PROXY_INTEGRATION_HEADERS:
      return new InvalidProxyIntegrationHeadersError(error.message)

    case FingerprintJSPro.ERROR_PROXY_INTEGRATION_SECRET_ENVIRONMENT_MISMATCH:
      return new ProxyIntegrationSecretEnvironmentMismatch(error.message)

    case FingerprintJSPro.ERROR_INVALID_PROXY_INTEGRATION_SECRET:
      return new InvalidProxyIntegrationSecretError(error.message)

    default:
      return new UnknownError(error.message)
  }
}
