import type { Tags, VisitorId, NativeVisitorData } from './types'

declare module 'react-native' {
  interface RNFingerprintjsPro {
    configure: (
      apiKey: string,
      region?: string,
      endpointUrl?: string,
      fallbackEndpointUrls?: string[],
      extendedResponseFormat: boolean,
      packageVersion: string,
      allowUseOfLocationData: boolean,
      locationTimeoutMillisAndroid: number
    ) => void
    getVisitorId: (tags?: Tags, linkedId?: string) => Promise<VisitorId>
    getVisitorIdWithTimeout: (tags?: Tags, linkedId?: string, timeout: number) => Promise<VisitorId>
    getVisitorData: (tags?: Tags, linkedId?: string) => Promise<NativeVisitorData>
    getVisitorDataWithTimeout: (tags?: Tags, linkedId?: string, timeout: number) => Promise<NativeVisitorData>
  }

  export interface NativeModulesStatic {
    RNFingerprintjsPro: RNFingerprintjsPro
  }
}
