import { device, expect } from 'detox'

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should have welcome screen', async () => {
    await device.disableSynchronization()
    await expect(element(by.text('Hello World!'))).toBeVisible()
  })
})
