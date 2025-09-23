import type { CacheLocation, FpjsClientOptions, ICache } from '@fingerprintjs/fingerprintjs-pro-spa'

export interface ProAgent {
  /**
   * Returns visitor identifier based on the request options.
   *
   * @param tags - Custom tags attached to the event.
   * @param linkedId - Event linkage identifier.
   * @param options - Custom request options.
   */
  getVisitorId(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<string>

  /**
   * Returns visitor identification data based on the request options.
   *
   * @param tags - Custom tags attached to the event.
   * @param linkedId - Event linkage identifier.
   * @param options - Custom request options.
   */
  getVisitorData(tags?: Tags, linkedId?: string, options?: RequestOptions): Promise<VisitorData>
}

export interface RequestOptions {
  /**
   * Custom timeout for the request in milliseconds
   */
  timeout?: number
}
/**
 * Configuration options for the {@link FingerprintJsProProvider} and {@link FingerprintJsProAgent}
 *
 * @group Types and interfaces
 */
export interface FingerprintJsProAgentParams {
  /**
   * your public API key that authenticates the agent with the API
   */
  apiKey: string
  /**
   * which region to use
   */
  region?: Region
  /**
   * server API URL, should be only used with the Custom subdomain
   */
  endpointUrl?: string
  /**
   * provide array of endpoints to specify fallbacks
   */
  fallbackEndpointUrls?: string[]
  /**
   * set this flag to get response in extended format
   */
  extendedResponseFormat?: boolean
  /**
   * Custom request options
   */
  requestOptions?: RequestOptions
  /**
   * set this flag to allow Fingerprint SDK to collect location data on Mobile platforms
   */
  allowUseOfLocationData?: boolean
  /**
   * location retrieval timeout for Android platform
   * The SDK will delay identification up to the specified timeout to collect the device location.
   * If it cannot collect the location information within the specified time,
   * identification continues without location information.
   */
  locationTimeoutMillisAndroid?: number

  /**
   * The pattern of the JS agent script URL.
   * If multiple endpoints are given, the agent will try them one by one until it finds a working one.
   * If an empty array is given, the agent will throw an error.
   *
   * @platform web
   */
  scriptUrlPattern?: FpjsClientOptions['loadOptions']['scriptUrlPattern']

  /**
   * Override storages name (cookies, localStorage, etc).
   * Should only be used when the default name conflicts with some of your existing names.
   * @default '_vid'
   *
   * @platform web
   */
  storageKey?: FpjsClientOptions['loadOptions']['storageKey']

  /**
   * Hashes URL parts before sending them to Fingerprint the server.
   * The sources of URLs: window.location.href, document.referrer.
   * Сan be used to hide sensitive data (tokens, payment info, etc) that these URLs may contain.
   *
   * Example of URL stripping 'https://example.com/path?token=secret#anchor' -> 'https://example.com/oK-fhlv2N-ZzaBf0zlUuTN97jDbqdbwlTB0fCvdEtb8?E1kifZXhuoBEZ_zkQa60jyxcaHNX3QFaydaaIEtL7j0#eb-w4rp2udRHYG3bzElINPBaTBHesFLnS0nqMHo8W80'
   *
   * @platform web
   */
  urlHashing?: FpjsClientOptions['loadOptions']['urlHashing']

  /**
   * Enables data collection for remote control detection.
   * Once enabled, please contact our support team to active the result exposure.
   * @see https://fingerprint.com/support/
   *
   * @default false
   *
   * @see https://dev.fingerprint.com/docs/smart-signals-overview#remote-control-tools-detection
   *
   * @platform web
   */
  remoteControlDetection?: FpjsClientOptions['loadOptions']['remoteControlDetection']

  /**
   * Defines which built-in cache mechanism the client should use.
   *
   * @platform web
   */
  cacheLocation?: CacheLocation

  /**
   * Custom cache implementation. Takes precedence over the `cacheLocation` property.
   *
   * @platform web
   */
  cache?: ICache

  /**
   * Duration in seconds for which data is stored in cache. Cannot exceed 86_400 (24h) because caching data
   * for longer than 24 hours can negatively affect identification accuracy.
   *
   * @platform web
   */
  cacheTimeInSeconds?: number
  /**
   * Custom prefix for localStorage and sessionStorage cache keys. Will be ignored if `cache` is provided.
   *
   * @platform web
   */
  cachePrefix?: string
}

export interface QueryResult<TData, TError = Error> {
  /**
   * Visitor identification data
   */
  data?: TData
  /**
   * Request state after calling `getData()`
   */
  isLoading?: boolean
  /**
   * Error message in case of failed `getData()` call
   */
  error?: TError
}

/**
 * The {@link https://dev.fingerprint.com/docs/regions | region} of your application.
 * The parameter is fully optional because JS agent detects the regions automatically using the provided API key.
 * Nevertheless, we recommend always specifying the parameter. Otherwise, the default region us.
 * @group Types and interfaces
 */
export type Region = 'eu' | 'us' | 'ap'

/**
 * Visitor identification data
 *
 * @group Types and interfaces
 */
export type VisitorData = ShortVisitorData | ExtendedVisitorData

/**
 * Main identification information about the visitor
 * @group Types and interfaces
 */
export interface ShortVisitorData {
  /**
   * The visitor identifier
   */
  visitorId: string
  /**
   * The current request identifier. It's different for every request.
   */
  requestId: string
  /**
   * A confidence score that tells how much the agent is sure about the visitor identifier
   */
  confidence: Confidence
  /**
   * See more details in the Sealed Client Results(https://dev.fingerprint.com/docs/sealed-client-results) guide. The field will miss if Sealed Client Results are disabled or unavailable for another reason.
   */
  sealedResult?: string
}

/**
 * Represents the probability of accurate identification.
 *
 * @group Types and interfaces
 */
export interface Confidence {
  /**
   * A number between 0 and 1 that tells how much the agent is sure about the visitor identifier.
   * The higher the number, the higher the chance of the visitor identifier to be true.
   */
  score: number
  /**
   * Additional details about the score as a human-readable text
   */
  comment?: string
}

/**
 * All known identification information about the visitor
 *
 * @group Types and interfaces
 */
export interface ExtendedVisitorData extends ShortVisitorData {
  /**
   * If true, this visitor was found and visited before.
   * If false, this visitor wasn't found and probably didn't visit before.
   */
  visitorFound: boolean
  /**
   * IP address. Only IPv4 are returned.
   * @example
   * '191.14.35.17'
   */
  ip: string
  /**
   * IP address location. Can be empty for anonymous proxies
   */
  ipLocation?: IpLocation
  /**
   * OS name.
   * @example
   * 'iOS'
   * @example
   * 'Android'
   */
  os: string
  /**
   * OS version
   * @example
   * '10.13.6'
   */
  osVersion: string
  /**
   * Device.
   * @example
   * 'Samsung SM-J330F'
   */
  device: string
  /**
   * When the visitor was seen for the first time
   */
  firstSeenAt: SeenAt
  /**
   * When the visitor was seen previous time
   */
  lastSeenAt: SeenAt
}

/**
 * {@link https://dev.fingerprint.com/docs/geolocation | IP address location}. Can be empty for anonymous proxies.
 *
 * @group Types and interfaces
 */
export interface IpLocation {
  /**
   * IP address location detection radius. Smaller values (<50mi) are business/residential,
   * medium values (50 < x < 500) are cellular towers (usually),
   * larger values (>= 500) are cloud IPs or proxies, VPNs.
   * Can be missing, in case of Tor/proxies.
   */
  accuracyRadius?: number
  /**
   * Latitude
   * Can be missing, in case of Tor/proxies.
   * @example
   * -19.8975
   */
  latitude?: number
  /**
   * Longitude
   * Can be missing, in case of Tor/proxies.
   * @example
   * -43.9625
   */
  longitude?: number
  /**
   * Timezone of the IP address location
   * @example
   * 'America/Chicago'
   */
  timezone?: string
  /**
   * Postal code, when available
   */
  postalCode?: string
  /**
   * City, when available
   */
  city?: {
    name: string
  }
  /**
   * Administrative subdivisions array (for example states|provinces -> counties|parishes).
   * Can be empty or missing.
   * When not empty, can contain only top-level administrative units within a country, e.g. a state.
   */
  subdivisions?: [
    {
      isoCode: string
      name: string
    }
  ]
  /**
   * Country, when available. Will be missing for Tor/anonymous proxies.
   */
  country?: {
    name: string
    code: string
  }
  /**
   * Continent, when available. Will be missing for Tor/anonymous proxies.
   */
  continent?: {
    name: string
    code: string
  }
}

/**
 *
 * @group Types and interfaces
 */
export interface SeenAt {
  /**
   * The date and time within your subscription. The string format is ISO-8601.
   * @example
   * '2022-03-16T05:18:24.610Z'
   * new Date(result.firstSeenAt.subscription)
   */
  subscription: string | null
  /**
   * The date and time across all subscription. The string format is ISO-8601.
   * @example
   * '2022-03-16T05:18:24.610Z'
   * new Date(result.firstSeenAt.global)
   */
  global: string | null
}

/**
 * Tags are returned in the webhook response so make sure the map you are passing to the library represents a valid JSON.
 *
 * @group Types and interfaces
 */
export type Tags = { [K in string]: Tag | Tag[] }

/**
 * Tags are returned in the webhook response so make sure the map you are passing to the library represents a valid JSON.
 *
 * @group Types and interfaces
 */
export type Tag = string | number | boolean | Tags

export interface VisitorQueryResult extends QueryResult<VisitorData> {
  /**
   * Visitor identification dataaaa
   */
  data?: VisitorData
}

/**
 * @group Hooks approach
 */
export interface VisitorQueryContext extends VisitorQueryResult {
  /**
   * Retrieve the visitor identifier using your public API key.
   * @param tags is a customer-provided value or an object that will be saved together with the analysis event and will be returned back to you in a webhook message or when you search for the visit in the server API. {@link https://dev.fingerprint.com/docs/js-agent#tag | more info in the documentation page}
   * @param linkedId  is a way of linking current analysis event with a custom identifier. This will allow you to filter visit information when using the Server API {@link https://dev.fingerprint.com/docs/js-agent#linkedid | more info in the documentation page}
   */
  getData: (tags?: Tags, linkedId?: string, options?: RequestOptions) => Promise<VisitorData | null>
}

export type VisitorId = string
