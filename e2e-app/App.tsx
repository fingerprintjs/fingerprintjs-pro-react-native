// SafeAreaView is deprecated in newer RN versions, react-native-safe-area-context is recommended
// but it doesn't work nicely with older RN versions that we also run tests against, so keep SafeAreaView import from react-native for now
import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { FingerprintJsProProvider, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react-native'
import { testIds } from '@/e2e/ids'
import { useEffect, useState } from 'react'
import { testTags } from '@/e2e/tags'
import config from '@/src/config'
import { ArchInfo } from '@/src/components/ArchInfo'

export type BenchmarkStats = {
  min: number
  max: number
  avg: number
  p50: number
  p95: number
}

function InnerApp() {
  const { isLoading, error, data, getData } = useVisitorData()

  const [isBenchmarking, setIsBenchmarking] = useState(false)
  const [benchmarkProgress, setBenchmarkProgress] = useState<string | null>(null)
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkStats | null>(null)
  const [benchmarkError, setBenchmarkError] = useState<string | null>(null)

  const doGetData = async () => {
    const tags = config.useTags ? testTags : undefined

    await getData(tags, config.linkedId)
  }

  const doMeasurePerformance = async () => {
    setIsBenchmarking(true)
    setBenchmarkResults(null)
    setBenchmarkError(null)
    setBenchmarkProgress('Starting benchmark...')

    const iterations = 100
    const durations: number[] = []
    const tags = config.useTags ? testTags : undefined

    try {
      for (let i = 0; i < iterations; i++) {
        setBenchmarkProgress(`Running iteration ${i + 1}/${iterations}...`)

        const start = performance.now()
        await getData(tags, config.linkedId)
        const end = performance.now()

        durations.push(end - start)

        // Give the JS thread a small break to update state and render progress
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 50)
        })
      }

      const min = Math.min(...durations)
      const max = Math.max(...durations)
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length
      const sorted = [...durations].sort((a, b) => a - b)
      const p50 = sorted[Math.floor(durations.length * 0.5)]
      const p95 = sorted[Math.floor(durations.length * 0.95)]

      setBenchmarkResults({ min, max, avg, p50, p95 })
      setBenchmarkProgress(null)
    } catch (err) {
      console.error(err)
      setBenchmarkError(err instanceof Error ? err.message : String(err))
      setBenchmarkProgress(null)
    } finally {
      setIsBenchmarking(false)
    }
  }

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <View style={{ flex: 1 }}>
      {}
      <SafeAreaView
        style={{
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <ArchInfo />
        {isLoading ? <Text testID={testIds.loading}>Loading...</Text> : null}
        {error ? (
          <View>
            <Text testID={testIds.errorName}>{error.name}</Text>
            <Text testID={testIds.errorMessage}>{error.message}</Text>
            {error.stack ? <Text testID={testIds.errorStack}>{error.stack}</Text> : null}
            {error.cause ? <Text testID={testIds.errorCause}>{JSON.stringify(error.cause)}</Text> : null}
          </View>
        ) : null}
        {data ? <Text testID={testIds.data}>{JSON.stringify(data)}</Text> : null}

        <View style={{ marginTop: 24, marginBottom: 24, alignItems: 'center' }}>
          <Pressable
            testID={testIds.getData}
            onPress={doGetData}
            disabled={isBenchmarking}
            style={{
              padding: 12,
              backgroundColor: isBenchmarking ? '#cccccc' : '#2196F3',
              borderRadius: 8,
              marginBottom: 12,
              minWidth: 200,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Get data</Text>
          </Pressable>

          <Pressable
            testID={testIds.measurePerformance}
            onPress={doMeasurePerformance}
            disabled={isBenchmarking}
            style={{
              padding: 12,
              backgroundColor: isBenchmarking ? '#ff9800' : '#4CAF50',
              borderRadius: 8,
              minWidth: 200,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
              {isBenchmarking ? 'Measuring...' : 'Measure Performance'}
            </Text>
          </Pressable>
        </View>

        {benchmarkProgress ? (
          <Text testID={testIds.benchmarkProgress} style={{ color: '#888888', fontStyle: 'italic' }}>
            {benchmarkProgress}
          </Text>
        ) : null}

        {benchmarkError ? <Text style={{ color: 'red', marginTop: 8 }}>Error: {benchmarkError}</Text> : null}

        {benchmarkResults ? (
          <View style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, minWidth: 250 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
              Benchmark Results (100 runs)
            </Text>
            <Text testID={testIds.benchmarkMin}>Min: {benchmarkResults.min.toFixed(2)}ms</Text>
            <Text testID={testIds.benchmarkMax}>Max: {benchmarkResults.max.toFixed(2)}ms</Text>
            <Text testID={testIds.benchmarkP50}>Median (p50): {benchmarkResults.p50.toFixed(2)}ms</Text>
            <Text testID={testIds.benchmarkP95}>95th Percentile: {benchmarkResults.p95.toFixed(2)}ms</Text>
            <Text testID={testIds.benchmarkAvg} style={{ fontWeight: 'bold', marginTop: 4 }}>
              Avg: {benchmarkResults.avg.toFixed(2)}ms
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  )
}

export default function App() {
  return (
    <FingerprintJsProProvider apiKey={config.apiKey} region={config.region}>
      <InnerApp />
    </FingerprintJsProProvider>
  )
}
