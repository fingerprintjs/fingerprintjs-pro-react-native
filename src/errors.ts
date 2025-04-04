/**
 * Something was wrong while building URL for identification request
 *
 * @group Errors
 */
export class InvalidUrlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidURL'
  }
}

/**
 * Something was wrong with params while building URL for identification request
 *
 * @group Errors
 */
export class InvalidURLParamsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidURLParams'
  }
}

/**
 * Unknown API error
 *
 * @group Errors
 */
export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Token is missing in the request
 *
 * @group Errors
 */
export class ApiKeyRequiredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiKeyRequiredError'
  }
}

/**
 * Wrong token
 *
 * @group Errors
 */
export class ApiKeyNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiKeyNotFoundError'
  }
}

/**
 * API token is outdated
 *
 * @group Errors
 */
export class ApiKeyExpiredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiKeyExpiredError'
  }
}

/**
 * Wrong request format (content, parameters)
 *
 * @group Errors
 */
export class RequestCannotBeParsedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestCannotBeParsedError'
  }
}

/**
 * Request failed
 *
 * @group Errors
 */
export class FailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FailedError'
  }
}

/**
 * Server timeout
 *
 * @group Errors
 */
export class RequestTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestTimeoutError'
  }
}

/**
 * Request limit for token reached
 *
 * @group Errors
 */
export class TooManyRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TooManyRequestError'
  }
}

/**
 * Request Filtering deny origin
 *
 * @group Errors
 */
export class OriginNotAvailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OriginNotAvailableError'
  }
}

/**
 * Request Filtering deny some headers
 *
 * @group Errors
 */
export class HeaderRestrictedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HeaderRestrictedError'
  }
}

/**
 * Request Filtering deny this hostname
 *
 * @group Errors
 */
export class HostnameRestrictedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HostnameRestrictedError'
  }
}

/**
 * Request Filtering deny crawlers
 *
 * @group Errors
 */
export class NotAvailableForCrawlBotsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotAvailableForCrawlBotsError'
  }
}

/**
 * Request Filtering deny empty UA
 *
 * @group Errors
 */
export class NotAvailableWithoutUAError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotAvailableWithoutUAError'
  }
}

/**
 * API key does not match the selected region
 *
 * @group Errors
 */
export class WrongRegionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WrongRegionError'
  }
}

/**
 * Subscription is not active for the provided API key
 *
 * @group Errors
 */
export class SubscriptionNotActiveError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubscriptionNotActiveError'
  }
}

/**
 * Something wrong with used API version
 *
 * @group Errors
 */
export class UnsupportedVersionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsupportedVersionError'
  }
}

/**
 *
 *
 * @group Errors
 */
export class InstallationMethodRestrictedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InstallationMethodRestrictedError'
  }
}

/**
 * Error while parsing the response
 *
 * @group Errors
 */
export class ResponseCannotBeParsedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResponseCannotBeParsedError'
  }
}

/**
 * Something wrong with network
 *
 * @group Errors
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Error while parsing JSON response
 *
 * @group Errors
 */
export class JsonParsingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'JsonParsingError'
  }
}

/**
 * Bad response type
 *
 * @group Errors
 */
export class InvalidResponseTypeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidResponseType'
  }
}

/**
 * Client-side timeout error
 *
 * @group Errors
 */
export class ClientTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClientTimeoutError'
  }
}

/**
 * Other error
 *
 * @group Errors
 */
export class UnknownError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnknownError'
  }
}

/**
 * Unexpected proxy integration implementation or networking error
 *
 * @group Errors
 */
export class InvalidProxyIntegrationHeadersError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidProxyIntegrationHeadersError'
  }
}

/**
 * Proxy integration secret is missing or invalid
 *
 * @group Errors
 */
export class InvalidProxyIntegrationSecretError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidProxyIntegrationSecretError'
  }
}

export type IdentificationError =
  | InvalidUrlError
  | InvalidURLParamsError
  | ApiError
  | ApiKeyRequiredError
  | ApiKeyNotFoundError
  | ApiKeyExpiredError
  | RequestCannotBeParsedError
  | FailedError
  | RequestTimeoutError
  | TooManyRequestError
  | OriginNotAvailableError
  | HeaderRestrictedError
  | NotAvailableForCrawlBotsError
  | NotAvailableWithoutUAError
  | WrongRegionError
  | SubscriptionNotActiveError
  | UnsupportedVersionError
  | InstallationMethodRestrictedError
  | ResponseCannotBeParsedError
  | NetworkError
  | JsonParsingError
  | InvalidResponseTypeError
  | ClientTimeoutError
  | UnknownError
  | InvalidProxyIntegrationHeadersError
  | InvalidProxyIntegrationSecretError

export function unwrapError(error: Error): IdentificationError {
  const [errorType, ...errorMessageParts] = error.message.split(':')
  const errorMessage = errorMessageParts.join(':')
  switch (errorType) {
    case 'InvalidURL':
      return new InvalidUrlError(errorMessage)
    case 'InvalidURLParams':
      return new InvalidURLParamsError(errorMessage)
    case 'ApiError':
      return new ApiError(errorMessage)
    // Api Errors block
    case 'ApiKeyRequired':
    case 'TokenRequired':
      return new ApiKeyRequiredError(errorMessage)
    case 'ApiKeyNotFound':
    case 'TokenNotFound':
      return new ApiKeyNotFoundError(errorMessage)
    case 'ApiKeyExpired':
    case 'TokenExpired':
      return new ApiKeyExpiredError(errorMessage)
    case 'RequestCannotBeParsed':
      return new RequestCannotBeParsedError(errorMessage)
    case 'Failed':
      return new FailedError(errorMessage)
    case 'RequestTimeout':
      return new RequestTimeoutError(errorMessage)
    case 'TooManyRequest':
      return new TooManyRequestError(errorMessage)
    case 'OriginNotAvailable':
      return new OriginNotAvailableError(errorMessage)
    case 'HeaderRestricted':
      return new HeaderRestrictedError(errorMessage)
    case 'HostnameRestricted':
      return new HostnameRestrictedError(errorMessage)
    case 'NotAvailableForCrawlBots':
      return new NotAvailableForCrawlBotsError(errorMessage)
    case 'NotAvailableWithoutUA':
      return new NotAvailableWithoutUAError(errorMessage)
    case 'WrongRegion':
      return new WrongRegionError(errorMessage)
    case 'SubscriptionNotActive':
      return new SubscriptionNotActiveError(errorMessage)
    case 'UnsupportedVersion':
      return new UnsupportedVersionError(errorMessage)
    case 'InstallationMethodRestricted':
      return new InstallationMethodRestrictedError(errorMessage)
    case 'ResponseCannotBeParsed':
      return new ResponseCannotBeParsedError(errorMessage)
    case 'InvalidProxyIntegrationHeaders':
      return new InvalidProxyIntegrationHeadersError(errorMessage)
    case 'InvalidProxyIntegrationSecret':
      return new InvalidProxyIntegrationSecretError(errorMessage)
    // end of API Errors block
    case 'ClientTimeout':
      return new ClientTimeoutError(errorMessage)
    case 'NetworkError':
      return new NetworkError(errorMessage)
    case 'JsonParsingError':
      return new JsonParsingError(errorMessage)
    case 'InvalidResponseType':
      return new InvalidResponseTypeError(errorMessage)
    default:
      return new UnknownError(error.message)
  }
}
