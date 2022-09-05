export interface QueryResult<TData, TError = Error> {
  data?: TData
  isLoading?: boolean
  error?: TError
}

export type Region = 'eu' | 'us' | 'ap'

export interface VisitorData {
  visitorId: string
}

export type Tags = { [K in string]: Tag | Tag[] }
type Tag = string | number | boolean | Tags

export interface VisitorQueryResult extends QueryResult<VisitorData> {
  data?: VisitorData
}

export interface VisitorQueryContext extends VisitorQueryResult {
  getData: (tags?: Tags, linkedId?: String) => Promise<VisitorData | void>
}
