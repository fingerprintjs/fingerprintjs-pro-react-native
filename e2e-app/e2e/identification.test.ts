import { device } from 'detox'
import { expect, it, describe, beforeAll, jest } from '@jest/globals'
import { DecryptionAlgorithm, FingerprintServerApiClient, Region, unsealEventsResponse } from '@fingerprint/node-sdk'
import { testTags } from './tags'
import { DeviceLaunchAppConfig } from 'detox/detox'
import { identify, identifyWithError } from './identify'
import { wait } from './wait'
import { Config } from '@/src/config.types'

const VISITOR_ID_REGEX = /^[a-zA-Z\d]{20}$/

async function launchApp(params?: DeviceLaunchAppConfig) {
  await device.launchApp(params)

  await wait(4000)
}

jest.retryTimes(3, {
  waitBeforeRetry: 1000,
  logErrorsBeforeRetry: false,
})

describe.each([
  ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
  ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
] as const)('React Native Identification on %s Region', (region, apiKey, privateApiKey) => {
  let client: FingerprintServerApiClient

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

    client = new FingerprintServerApiClient({
      apiKey: privateApiKey,
      region: serverRegion,
    })

    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey,
        region,
      } as Config,
    })
  })

  it('should return visitor data', async () => {
    const identificationResult = await identify()
    expect(identificationResult.visitor_id).toMatch(VISITOR_ID_REGEX)

    const event = await client.getEvent(identificationResult.event_id)
    expect(event.identification?.visitor_id).toEqual(identificationResult.visitor_id)
    expect(event.event_id).toEqual(identificationResult.event_id)
  })
})

describe.each([
  ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
  ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
] as const)('React Native Identification on %s Region with linkedId and tags', (region, apiKey, privateApiKey) => {
  let client: FingerprintServerApiClient

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

    client = new FingerprintServerApiClient({
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
      } as Config,
    })
  })

  it('should return visitor data with linkedId and tag', async () => {
    const identificationResult = await identify()
    expect(identificationResult.visitor_id).toMatch(VISITOR_ID_REGEX)

    const event = await client.getEvent(identificationResult.event_id)
    expect(event.linked_id).toEqual(linkedId)
    expect(event.tags).toEqual(testTags)
  })
})

describe('React Native Identification invalid API Key', () => {
  beforeAll(async () => {
    await launchApp({
      newInstance: true,
      launchArgs: {
        apiKey: 'invalid',
      } as Config,
    })
  })

  it('should return error', async () => {
    const error = await identifyWithError()
    // v4 collapses every error into a single `FingerprintError` discriminated by `code`. The native
    // SDKs forward the server's code for an unknown public key.
    expect(error.name).toEqual('FingerprintError')
    expect(error.code).toEqual('public_api_key_not_found')
  })
})

describe('React Native Identification with sealed results', () => {
  const encryptionKey = process.env.MINIMUM_US_SEALED_ENCRYPTION_KEY ?? ''
  const apiKey = process.env.MINIMUM_US_SEALED_PUBLIC_KEY ?? ''

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
      } as Config,
    })
  })

  it('should return sealed visitor data', async () => {
    const identificationResult = await identify()
    expect(identificationResult.event_id).toBeTruthy()
    expect(identificationResult.sealed_result).toBeTruthy()

    const unsealedData = await unsealEventsResponse(Buffer.from(identificationResult.sealed_result ?? '', 'base64'), [
      {
        key: Buffer.from(encryptionKey, 'base64'),
        algorithm: DecryptionAlgorithm.Aes256Gcm,
      },
    ])

    expect(unsealedData).toBeTruthy()
    expect(unsealedData.event_id).toEqual(identificationResult.event_id)
  })
})
