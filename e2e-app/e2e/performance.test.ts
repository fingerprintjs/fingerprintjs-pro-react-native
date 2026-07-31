import { by, element, waitFor, device } from 'detox'
import { it, describe, beforeAll } from '@jest/globals'
import { testIds } from './ids'
import { getElementText } from './getElementText'
import { wait } from './wait'
import { Config } from '@/src/config.types'

const apiKey = process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY
const region = 'us'

async function launchApp() {
  if (!apiKey) {
    throw new Error('MINIMUM_US_DEFAULT_PUBLIC_KEY is required to run performance tests')
  }

  await device.launchApp({
    newInstance: true,
    launchArgs: {
      apiKey,
      region,
    } as Config,
  })
  await wait(4000)
}

describe('SDK Architecture Performance Benchmark', () => {
  beforeAll(async () => {
    await launchApp()
  })

  it('triggers the Measure Performance button and reports final statistics', async () => {
    console.log('Tapping the Measure Performance button in the app...')
    await element(by.id(testIds.measurePerformance)).tap()

    console.log('Waiting for the 100-run benchmark to complete...')

    // 100 runs can take ~20-30 seconds depending on network conditions. Wait up to 90 seconds.
    await waitFor(element(by.id(testIds.benchmarkAvg)))
      .toExist()
      .withTimeout(90_000)

    console.log('Benchmark complete! Reading statistics...')

    const minText = await getElementText(element(by.id(testIds.benchmarkMin)))
    const maxText = await getElementText(element(by.id(testIds.benchmarkMax)))
    const p50Text = await getElementText(element(by.id(testIds.benchmarkP50)))
    const p95Text = await getElementText(element(by.id(testIds.benchmarkP95)))
    const avgText = await getElementText(element(by.id(testIds.benchmarkAvg)))
    const uiManagerText = await getElementText(element(by.id(testIds.uiManager)))

    console.log('\n==================================================')
    console.log(`BENCHMARK RESULTS FROM APP UI - ${uiManagerText}`)
    console.log(`- ${minText}`)
    console.log(`- ${maxText}`)
    console.log(`- ${p50Text}`)
    console.log(`- ${p95Text}`)
    console.log(`- ${avgText}`)
    console.log('==================================================\n')
  })
})
