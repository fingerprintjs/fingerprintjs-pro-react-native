import { by, device, element, waitFor } from 'detox'
import { expect } from '@jest/globals'
import type { LaunchArgs } from '@/App'
import { testIds } from './ids'
import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api'

const VISITOR_ID_REGEX = /^[a-zA-Z\d]{20}$/

async function identify() {
  await element(by.id(testIds.getData)).tap()
  await waitFor(element(by.id(testIds.data)))
    .toExist()
    .withTimeout(10_000)

  const attributes = (await element(by.id(testIds.data)).getAttributes()) as Record<string, any>
  const text = attributes?.text ?? attributes?.label

  return JSON.parse(text) as { visitorId: string; requestId: string }
}

describe.each([['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY]] as const)(
  'React Native Identification on %s Region',
  (region, apiKey, privateApiKey) => {
    let client: FingerprintJsServerApiClient

    beforeAll(async () => {
      if (!apiKey) {
        throw new Error('apiKey is required to run this test')
      }

      if (!privateApiKey) {
        throw new Error('privateApiKey is required to run this test')
      }

      let serverRegion: Region

      switch (region) {
        case 'us':
        default:
          serverRegion = Region.Global
          break
      }

      client = new FingerprintJsServerApiClient({
        apiKey: privateApiKey,
        region: serverRegion,
      })
    })

    it('should return visitor data', async () => {
      await device.launchApp({
        newInstance: true,
        launchArgs: {
          apiKey,
          region,
        } as LaunchArgs,
      })

      const identificationResult = await identify()
      expect(identificationResult.visitorId).toMatch(VISITOR_ID_REGEX)

      const event = await client.getEvent(identificationResult.requestId)
      expect(event.products.identification?.data?.visitorId).toEqual(identificationResult.visitorId)
      expect(event.products.identification?.data?.requestId).toEqual(identificationResult.requestId)
    })

    it('should return visitor data with linkedId and tag', async () => {
      const linkedId = `${Date.now()}-rn-test`
      const tags = {
        'react-native-test': true,
      }

      await device.launchApp({
        newInstance: true,
        launchArgs: {
          apiKey,
          region,
          linkedId,
          tags,
        } as LaunchArgs,
      })

      const identificationResult = await identify()
      expect(identificationResult.visitorId).toMatch(VISITOR_ID_REGEX)

      const event = await client.getEvent(identificationResult.requestId)
      expect(event.products.identification?.data?.linkedId).toEqual(linkedId)
      expect(event.products.identification?.data?.tag).toEqual(tags)
    })
  }
)
