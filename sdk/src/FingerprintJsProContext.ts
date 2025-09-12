import { createContext } from 'react'
import { Tags, VisitorData, RequestOptions } from './types'

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <FingerprintJsProProvider>.')
}

const initialContext = {
  visitorId: '',
  getVisitorData: stub,
}

export interface FingerprintJsProContextInterface {
  visitorId: string
  getVisitorData: (tags?: Tags, linkedId?: string, options?: RequestOptions) => Promise<VisitorData>
}

export const FingerprintJsProContext = createContext<FingerprintJsProContextInterface>(initialContext)
