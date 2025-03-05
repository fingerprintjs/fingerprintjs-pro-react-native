import { by, device, element, waitFor } from 'detox'
import type { LaunchArgs } from '@/App'
import { testIds } from './ids'

describe('React Native Identification on US Region', () => {
  beforeAll(async () => {
    const apiKey = process.env.MAXIMUM_US_DEFAULT_PUBLIC_KEY

    if(!apiKey) {
      throw new Error('MAXIMUM_US_DEFAULT_PUBLIC_KEY is required to run this test')
    }

    await device.launchApp({
      newInstance: true,
      launchArgs: {
        apiKey,
        region: 'us',
      } as LaunchArgs,
    })
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
