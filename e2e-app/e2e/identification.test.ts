import { by, device, element, waitFor } from 'detox'
import type { LaunchArgs } from '@/App'
import { testIds } from './ids'

describe('React Native Identification on US Region', () => {
  beforeAll(async () => {
    await device.launchApp({
      launchArgs: {
        apiKey: process.env.MAXIMUM_US_DEFAULT_PUBLIC_KEY ?? '',
        region: 'us',
      } as LaunchArgs,
    })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should return visitor data', async () => {
    await element(by.id(testIds.getData)).tap()
    await waitFor(element(by.id(testIds.data)))
      .toExist()
      .withTimeout(10_000)

    const attributes = await element(by.id(testIds.data)).getAttributes()

    console.log(attributes)
  })
})
