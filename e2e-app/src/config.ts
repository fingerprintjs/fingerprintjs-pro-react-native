import { LaunchArguments } from 'react-native-launch-arguments'

import { Config } from '@/src/config.types'

const config: Config = LaunchArguments.value<Config>()

if (!config.apiKey) {
  console.warn('API key is not provided, fallback to env')
  config.apiKey = process.env.EXPO_PUBLIC_API_KEY ?? ''
}

export default config
