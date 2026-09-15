import { by, device, element, waitFor } from 'detox'
import { beforeAll, describe, expect, it, jest } from '@jest/globals'
import { DeviceLaunchAppConfig } from 'detox/detox'
import { wait } from './wait'
import { Config } from '@/src/config.types'
import { testIds } from '@/e2e/ids'
import { getElementText } from './getElementText'

async function launchApp(params?: DeviceLaunchAppConfig) {
  await device.launchApp(params)

  await wait(4000)
}

jest.retryTimes(3, {
  waitBeforeRetry: 1000,
  logErrorsBeforeRetry: false,
})

describe('React Native architecture', () => {
  beforeAll(async () => {
    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey: '',
        region: 'us',
      } as Config,
    })
  })

  it('runs on fabric', async () => {
    await waitFor(element(by.id(testIds.uiManager)))
      .toExist()
      .withTimeout(10_000)

    const uiManager = await getElementText(element(by.id(testIds.uiManager)))
    expect(uiManager.toLowerCase()).toEqual('fabric')
  })
})
