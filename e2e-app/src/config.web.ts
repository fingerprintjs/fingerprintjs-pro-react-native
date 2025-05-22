import { Config } from '@/src/config.types'
import { Region } from '@fingerprintjs/fingerprintjs-pro-react-native'

const config: Config = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY as string,
  region: process.env.EXPO_PUBLIC_REGION as Region,
}

export default config
