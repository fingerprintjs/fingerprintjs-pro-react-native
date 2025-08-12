import { Region } from '@fingerprintjs/fingerprintjs-pro-react-native'

export type Config = {
  apiKey: string
  region: Region
  useTags?: boolean
  linkedId?: string
}
