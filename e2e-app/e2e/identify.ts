import { by, element, waitFor } from 'detox'
import { testIds } from './ids'
import { getElementText } from './getElementText'

export async function identify() {
  await element(by.id(testIds.getData)).tap()
  await waitFor(element(by.id(testIds.data)))
    .toExist()
    .withTimeout(10_000)

  const text = await getElementText(element(by.id(testIds.data)))

  return JSON.parse(text) as {
    visitor_id: string
    event_id: string
    suspect_score?: number
    sealed_result: string | null
  }
}

export async function identifyWithError() {
  await element(by.id(testIds.getData)).tap()
  await waitFor(element(by.id(testIds.errorName)))
    .toExist()
    .withTimeout(10_000)

  const name = await getElementText(element(by.id(testIds.errorName)))
  const code = await getElementText(element(by.id(testIds.errorCode)))
  const message = await getElementText(element(by.id(testIds.errorMessage)))

  return { name, code, message }
}
