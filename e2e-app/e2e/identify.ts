import { by, element, waitFor } from 'detox'
import { testIds } from './ids'
import { getElementText } from './getElementText'

export async function identify() {
  await element(by.id(testIds.getData)).tap()
  await waitFor(element(by.id(testIds.data)))
    .toExist()
    .withTimeout(10_000)

  const text = await getElementText(element(by.id(testIds.data)))

  return JSON.parse(text) as { visitorId: string; requestId: string; sealedResult?: string }
}

export async function identifyWithError() {
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
