import { getNewArch } from '@/app-config-tools/arch'

export function withNewArchFlag(config: any) {
  config.newArchEnabled = getNewArch()
}
