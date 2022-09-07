export interface QueryResult<TData, TError = Error> {
  data?: TData
  isLoading?: boolean
  error?: TError
}

export type Region = 'eu' | 'us' | 'ap'

export type VisitorData = ShortVisitorData | ExtendedVisitorData

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
}

interface Confidence {
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

interface IpLocation {
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

interface SeenAt {
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

export type Tags = { [K in string]: Tag | Tag[] }
type Tag = string | number | boolean | Tags

export interface VisitorQueryResult extends QueryResult<VisitorData> {
  data?: VisitorData
}

export interface VisitorQueryContext extends VisitorQueryResult {
  getData: (tags?: Tags, linkedId?: String) => Promise<VisitorData | null>
}
