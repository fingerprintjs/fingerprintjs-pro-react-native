import {
  ApiError,
  ApiKeyExpiredError,
  ApiKeyNotFoundError,
  ApiKeyRequiredError,
  ClientTimeoutError,
  FailedError,
  HeaderRestrictedError,
  HostnameRestrictedError,
  IdentificationError,
  InstallationMethodRestrictedError,
  InvalidResponseTypeError,
  InvalidUrlError,
  InvalidURLParamsError,
  JsonParsingError,
  NetworkError,
  NotAvailableForCrawlBotsError,
  NotAvailableWithoutUAError,
  OriginNotAvailableError,
  RequestCannotBeParsedError,
  RequestTimeoutError,
  ResponseCannotBeParsedError,
  SubscriptionNotActiveError,
  TooManyRequestError,
  UnknownError,
  UnsupportedVersionError,
  WrongRegionError,
} from './errors'

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
