import { test, expect, Page } from '@playwright/test'
import {
  DecryptionAlgorithm,
  FingerprintJsServerApiClient,
  Region,
  unsealEventsResponse,
} from '@fingerprintjs/fingerprintjs-pro-server-api'
import { testTags } from '../e2e/tags'
import { testIds } from '../e2e/ids'
import { Config } from '../src/config.types'

const VISITOR_ID_REGEX = /^[a-zA-Z\d]{20}$/

async function setupPage(page: Page, config: Config) {
  const params = new URLSearchParams()

  if (config.apiKey) {
    params.set('apiKey', config.apiKey)
  }

  if (config.region) {
    params.set('region', config.region)
  }

  if (config.linkedId) {
    params.set('linkedId', config.linkedId)
  }

  if (config.useTags) {
    params.set('useTags', 'true')
  }

  // Navigate to the page with query parameters
  await page.goto(`/?${params.toString()}`)
}

// Helper function to get identification data
async function identify(page: Page) {
  // Click the "Get data" button
  await page.getByTestId(testIds.getData).click()

  // Wait for the data to be loaded
  await page.getByTestId(testIds.data).waitFor({ timeout: 10000 })

  // Get the data text and parse it as JSON
  const dataText = await page.getByTestId(testIds.data).textContent()
  if (!dataText) {
    throw new Error('Data text is empty')
  }

  return JSON.parse(dataText)
}

// Helper function to get error information
async function identifyWithError(page: Page) {
  // Click the "Get data" button
  await page.getByTestId(testIds.getData).click()

  // Wait for the error to be displayed
  await page.getByTestId(testIds.errorName).waitFor({ timeout: 10000 })

  // Get the error name, code and message
  const errorName = await page.getByTestId(testIds.errorName).textContent()
  const errorCode = await page.getByTestId(testIds.errorCode).textContent()
  const errorMessage = await page.getByTestId(testIds.errorMessage).textContent()

  return { name: errorName ?? '', code: errorCode ?? '', message: errorMessage ?? '' }
}

test.describe('Web tests', () => {
  // Test data for basic identification
  const basicIdentificationTestData = [
    ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
    ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
  ] as const

  // Using for...of loop instead of test.describe.each
  for (const [region, apiKey, privateApiKey] of basicIdentificationTestData) {
    test.describe(`Web Identification on ${region} Region`, () => {
      let client: FingerprintJsServerApiClient

      test.beforeEach(async ({ page }) => {
        if (!apiKey || !privateApiKey) {
          throw new Error('API keys are required to run this test')
        }

        let serverRegion = Region.Global
        if (region === 'eu') {
          serverRegion = Region.EU
        }

        client = new FingerprintJsServerApiClient({
          apiKey: privateApiKey,
          region: serverRegion,
        })

        await setupPage(page, {
          apiKey,
          region,
        })
      })

      test('should return visitor data', async ({ page }) => {
        const identificationResult = await identify(page)
        expect(identificationResult.visitor_id).toMatch(VISITOR_ID_REGEX)

        const event = await client.getEvent(identificationResult.event_id)
        expect(event.products.identification?.data?.visitorId).toEqual(identificationResult.visitor_id)
        expect(event.products.identification?.data?.requestId).toEqual(identificationResult.event_id)
      })
    })
  }

  // Test data for identification with linkedId and tags
  const linkedIdTagsTestData = [
    ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
    ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
  ] as const

  // Using for...of loop instead of test.describe.each
  for (const [region, apiKey, privateApiKey] of linkedIdTagsTestData) {
    test.describe(`Web Identification on ${region} Region with linkedId and tags`, () => {
      let client: FingerprintJsServerApiClient
      const linkedId = `${Date.now()}-web-test`

      test.beforeEach(async ({ page }) => {
        if (!apiKey || !privateApiKey) {
          throw new Error('API keys are required to run this test')
        }

        let serverRegion = Region.Global
        if (region === 'eu') {
          serverRegion = Region.EU
        }

        client = new FingerprintJsServerApiClient({
          apiKey: privateApiKey,
          region: serverRegion,
        })

        await setupPage(page, {
          apiKey,
          region,
          linkedId,
          useTags: true,
        })
      })

      test('should return visitor data with linkedId and tag', async ({ page }) => {
        const identificationResult = await identify(page)
        expect(identificationResult.visitor_id).toMatch(VISITOR_ID_REGEX)

        const event = await client.getEvent(identificationResult.event_id)
        expect(event.products.identification?.data?.linkedId).toEqual(linkedId)
        expect(event.products.identification?.data?.tag).toEqual(testTags)
      })
    })
  }

  test.describe('Web Identification invalid API Key', () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, {
        apiKey: 'invalid',
        region: 'us',
      })
    })

    test('should return error', async ({ page }) => {
      const error = await identifyWithError(page)
      // v4 collapses every error into a single `FingerprintError` discriminated by `code`. On web,
      // `@fingerprint/agent` classifies an unusable public key as `api_key_invalid`.
      expect(error.name).toEqual('FingerprintError')
      expect(error.code).toEqual('api_key_invalid')
    })
  })

  test.describe('Web Identification with sealed results', () => {
    const encryptionKey = process.env.MINIMUM_US_SEALED_ENCRYPTION_KEY
    const apiKey = process.env.MINIMUM_US_SEALED_PUBLIC_KEY

    test.beforeEach(async ({ page }) => {
      if (!apiKey || !encryptionKey) {
        throw new Error('Sealed API keys are required to run this test')
      }

      await setupPage(page, {
        apiKey,
        region: 'us',
      })
    })

    test('should return sealed visitor data', async ({ page }) => {
      const identificationResult = await identify(page)
      expect(identificationResult.event_id).toBeTruthy()
      expect(identificationResult.sealed_result).toBeTruthy()

      const unsealedData = await unsealEventsResponse(Buffer.from(identificationResult.sealed_result, 'base64'), [
        {
          key: Buffer.from(encryptionKey ?? '', 'base64'),
          algorithm: DecryptionAlgorithm.Aes256Gcm,
        },
      ])

      expect(unsealedData).toBeTruthy()
      expect(unsealedData.products.identification?.data?.requestId).toEqual(identificationResult.event_id)
    })
  })
})
