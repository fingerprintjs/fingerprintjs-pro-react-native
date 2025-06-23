import { Config } from '@/src/config.types'
import { Region } from '@fingerprintjs/fingerprintjs-pro-react-native'

const search = new URLSearchParams(window.location.search)

function getApiKey(): string {
  if (search.has('apiKey')) {
    return search.get('apiKey')!
  }

  if (process.env.EXPO_PUBLIC_API_KEY) {
    return process.env.EXPO_PUBLIC_API_KEY
  }

  throw new Error('API key is not provided')
}

function getRegion(): Region {
  if (search.has('region')) {
    return search.get('region') as Region
  }

  if (process.env.EXPO_PUBLIC_REGION) {
    return process.env.EXPO_PUBLIC_REGION as Region
  }

  return 'us'
}

const config: Config = {
  apiKey: getApiKey(),
  region: getRegion(),
  linkedId: search.get('linkedId') ?? undefined,
  useTags: search.get('useTags') === 'true',
}

export default config
