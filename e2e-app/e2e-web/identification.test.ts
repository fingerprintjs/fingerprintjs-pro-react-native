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

  // Get the error name and message
  const errorName = await page.getByTestId(testIds.errorName).textContent()
  const errorMessage = await page.getByTestId(testIds.errorMessage).textContent()

  const error = new Error(errorMessage ?? '')
  if (errorName) {
    error.name = errorName
  }

  return error
}

test.describe.each([
  ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
  ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
])('Web Identification on %s Region', (region, apiKey, privateApiKey) => {
  let client

  test.beforeEach(async ({ page }) => {
    test.skip(!apiKey || !privateApiKey, 'API keys are required to run this test')

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
    expect(identificationResult.visitorId).toMatch(VISITOR_ID_REGEX)

    const event = await client.getEvent(identificationResult.requestId)
    expect(event.products.identification?.data?.visitorId).toEqual(identificationResult.visitorId)
    expect(event.products.identification?.data?.requestId).toEqual(identificationResult.requestId)
  })
})

test.describe.each([
  ['us', process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY, process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY],
  ['eu', process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY, process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY],
])('Web Identification on %s Region with linkedId and tags', (region, apiKey, privateApiKey) => {
  let client
  const linkedId = `${Date.now()}-web-test`

  test.beforeEach(async ({ page }) => {
    test.skip(!apiKey || !privateApiKey, 'API keys are required to run this test')

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
    expect(identificationResult.visitorId).toMatch(VISITOR_ID_REGEX)

    const event = await client.getEvent(identificationResult.requestId)
    expect(event.products.identification?.data?.linkedId).toEqual(linkedId)
    expect(event.products.identification?.data?.tag).toEqual(testTags)
  })
})

test.describe('Web Identification invalid API Key', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      apiKey: 'invalid',
      region: 'us',
    })
  })

  test('should return error', async ({ page }) => {
    const error = await identifyWithError(page)
    expect(error.message).toEqual('invalid public key')
    expect(error.name).toEqual('ApiKeyNotFoundError')
  })
})

test.describe('Web Identification with sealed results', () => {
  const encryptionKey = process.env.MINIMUM_US_SEALED_ENCRYPTION_KEY
  const apiKey = process.env.MINIMUM_US_SEALED_PUBLIC_KEY

  test.beforeEach(async ({ page }) => {
    test.skip(!apiKey || !encryptionKey, 'Sealed API keys are required to run this test')

    await setupPage(page, {
      apiKey,
      region: 'us',
    })
  })

  test('should return sealed visitor data', async ({ page }) => {
    const identificationResult = await identify(page)
    expect(identificationResult.requestId).toBeTruthy()
    expect(identificationResult.sealedResult).toBeTruthy()

    const unsealedData = await unsealEventsResponse(Buffer.from(identificationResult.sealedResult, 'base64'), [
      {
        key: Buffer.from(encryptionKey, 'base64'),
        algorithm: DecryptionAlgorithm.Aes256Gcm,
      },
    ])

    expect(unsealedData).toBeTruthy()
    expect(unsealedData.products.identification?.data?.requestId).toEqual(identificationResult.requestId)
  })
})
