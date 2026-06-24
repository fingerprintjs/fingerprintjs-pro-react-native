import { getNewArch } from '@/app-config-tools/arch'

export function withNewArchFlag(config: any) {
  config.newArchEnabled = getNewArch()
}

// Older expo versions require splash to be defined
export function withSplashscreen(config: any) {
  config.splash = {
    backgroundColor: '#ffffff',
  }
}
