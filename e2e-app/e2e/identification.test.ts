import { by, device, element, waitFor } from 'detox'
import { expect } from '@jest/globals'
import type { LaunchArgs } from '@/App'
import { testIds } from './ids'
import {
  DecryptionAlgorithm,
  FingerprintJsServerApiClient,
  Region,
  unsealEventsResponse,
} from '@fingerprintjs/fingerprintjs-pro-server-api'
import { testTags } from './tags'
import { DeviceLaunchAppConfig, IndexableNativeElement } from 'detox/detox'

const VISITOR_ID_REGEX = /^[a-zA-Z\d]{20}$/

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function launchApp(params?: DeviceLaunchAppConfig) {
  await device.launchApp(params)

  await wait(4000)
}

async function getElementText(element: IndexableNativeElement): Promise<string> {
  const attributes = (await element.getAttributes()) as Record<string, any>
  return attributes?.text ?? attributes?.label ?? '';
}

async function identify() {
  await element(by.id(testIds.getData)).tap()
  await waitFor(element(by.id(testIds.data)))
    .toExist()
    .withTimeout(10_000)

  const text = await getElementText(element(by.id(testIds.data)))

  return JSON.parse(text) as { visitorId: string; requestId: string; sealedResult?: string }
}

async function identifyWithError() {
  await element(by.id(testIds.getData)).tap()
  await waitFor(element(by.id(testIds.errorName)))
    .toExist()
    .withTimeout(10_000)

  const errorName = await getElementText(element(by.id(testIds.errorName)))
  const errorMessage = await getElementText(element(by.id(testIds.errorMessage)))

  const error = new Error(errorMessage)
  error.name = errorName

  return error
}

describe.each([
  ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
  ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
] as const)('React Native Identification on %s Region', (region, apiKey, privateApiKey) => {
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
      case 'eu':
        serverRegion = Region.EU
        break

      case 'us':
      default:
        serverRegion = Region.Global
        break
    }

    client = new FingerprintJsServerApiClient({
      apiKey: privateApiKey,
      region: serverRegion,
    })

    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey,
        region,
      } as LaunchArgs,
    })
  })

  it('should return visitor data', async () => {
    const identificationResult = await identify()
    expect(identificationResult.visitorId).toMatch(VISITOR_ID_REGEX)

    const event = await client.getEvent(identificationResult.requestId)
    expect(event.products.identification?.data?.visitorId).toEqual(identificationResult.visitorId)
    expect(event.products.identification?.data?.requestId).toEqual(identificationResult.requestId)
  })
})

describe.each([
  ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
  ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
] as const)('React Native Identification on %s Region with linkedId and tags', (region, apiKey, privateApiKey) => {
  let client: FingerprintJsServerApiClient

  const linkedId = `${Date.now()}-rn-test`

  beforeAll(async () => {
    if (!apiKey) {
      throw new Error('apiKey is required to run this test')
    }

    if (!privateApiKey) {
      throw new Error('privateApiKey is required to run this test')
    }

    let serverRegion: Region

    switch (region) {
      case 'eu':
        serverRegion = Region.EU
        break

      case 'us':
      default:
        serverRegion = Region.Global
        break
    }

    client = new FingerprintJsServerApiClient({
      apiKey: privateApiKey,
      region: serverRegion,
    })

    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey,
        region,
        linkedId,
        useTags: true,
      } as LaunchArgs,
    })
  })

  it('should return visitor data with linkedId and tag', async () => {
    const identificationResult = await identify()
    expect(identificationResult.visitorId).toMatch(VISITOR_ID_REGEX)

    const event = await client.getEvent(identificationResult.requestId)
    expect(event.products.identification?.data?.linkedId).toEqual(linkedId)
    expect(event.products.identification?.data?.tag).toEqual(testTags)
  })
})

describe("React Native Identification invalid API Key", () => {
  beforeAll(async () => {
    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey: "invalid",
      } as LaunchArgs,
    })
  })

  it('should return error', async () => {
    const error = await identifyWithError()
    expect(error.message).toEqual('invalid public key')
    expect(error.name).toEqual('ApiKeyNotFoundError')
  })
})

describe('React Native Identification with sealed results', () => {
  const encryptionKey = process.env.MINIMUM_US_SEALED_ENCRYPTION_KEY!
  const apiKey = process.env.MINIMUM_US_SEALED_PUBLIC_KEY!

  beforeAll(async () => {
    if (!apiKey) {
      throw new Error('MINIMUM_US_SEALED_PUBLIC_KEY is required to run this test')
    }

    if (!encryptionKey) {
      throw new Error('MINIMUM_US_SEALED_ENCRYPTION_KEY is required to run this test')
    }

    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey,
        region: 'us',
      } as LaunchArgs,
    })
  })

  it('should return sealed visitor data', async () => {
    const identificationResult = await identify()
    expect(identificationResult.requestId).toBeTruthy()
    expect(identificationResult.sealedResult).toBeTruthy()

    const unsealedData = await unsealEventsResponse(Buffer.from(identificationResult.sealedResult!, 'base64'), [
      {
        key: Buffer.from(encryptionKey, 'base64'),
        algorithm: DecryptionAlgorithm.Aes256Gcm,
      },
    ])

    expect(unsealedData).toBeTruthy()
    expect(unsealedData.products.identification?.data?.requestId).toEqual(identificationResult.requestId)
  })
})
