export interface QueryResult<TData, TError = Error> {
  data?: TData;
  isLoading?: boolean;
  error?: TError;
}

export type Region = "eu" | "us" | "ap";

export interface VisitorData {
  visitorId: string;
}

export interface VisitorQueryResult extends QueryResult<VisitorData> {
  data?: VisitorData
}

export interface VisitorQueryContext extends VisitorQueryResult {
  getData: () => Promise<VisitorData | void>
}
