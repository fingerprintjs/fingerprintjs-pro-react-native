import { device, expect } from 'detox'
import type { LaunchArgs } from '@/App'

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({
      launchArgs: {
        apiKey: '1234',
        region: 'Test',
      } as LaunchArgs,
    })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should have welcome screen', async () => {
    await device.disableSynchronization()
    await expect(element(by.text('Hello World!'))).toExist()
    await expect(element(by.text('API Key: 1234'))).toExist()
    await expect(element(by.text('Region: Test'))).toExist()
  })
})
