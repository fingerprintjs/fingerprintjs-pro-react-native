---
'@fingerprintjs/fingerprintjs-pro-react-native': major
---

Migrated the SDK to Fingerprint API v4 and realigned the public API with `@fingerprint/react`. This is a breaking change on every platform (web, iOS, Android).

**Renamed API**

- `FingerprintJsProProvider` → `FingerprintProvider`.
- `FingerprintJsProAgent` (constructed with `new`) → `start(options)`, returning a client with a single `get(options)` method (`getVisitorId`/`getVisitorData` are removed).
- Added `useFingerprint()` to read the client from context.

**Single options object**

- `getData(tags, linkedId, options)` → `getData({ tags, linkedId, timeout })`.
- `useVisitorData` now returns a discriminated union (`data`/`isLoading`/`isFetched`/`error`), and `getData` always throws on error. The `throwOnError` option is removed. `immediate` defaults to `false`.

**Grouped provider/start options**

- Platform-only options are nested: `android` (`allowUseOfLocationData`, `locationTimeoutMillis`), `ios` (`allowUseOfLocationData`), `web` (`storageKeyPrefix`, `urlHashing`, `remoteControlDetection`, `cache`). `locationTimeoutMillisAndroid` moves to `android.locationTimeoutMillis`.
- `endpointUrl` + `fallbackEndpointUrls` are replaced by a single `endpoints` (string or string[]).

**snake_case response**

- The response is now the flat, snake_case `FingerprintResponse` (`visitor_id`, `event_id`, `suspect_score?`, `sealed_result`), matching the Server API v4 and JS agent. `requestId` is replaced by `event_id`, `confidence` is removed, and `suspect_score` is a new optional Smart Signals value; `sealedResult` is renamed to `sealed_result`. The nested extended fields (`ipLocation`, `firstSeenAt`, etc.) and the `extendedResponseFormat` option are removed (v4 always returns the flat format).

**Single error type**

- The ~28 error classes are replaced by a single `FingerprintError` (`{ name, code, event_id }`) plus an `isFingerprintError` type guard. Discriminate on `error.code` (e.g. `too_many_requests`).

**Web**

- The web implementation now uses `@fingerprint/agent` (v4) instead of `@fingerprintjs/fingerprintjs-pro-spa`. Install `@fingerprint/agent` as the web peer dependency.
- ️Caching is available only on **web** and is disabled by default. To enable caching on web, pass the JavaScript agent [cache](https://docs.fingerprint.com/reference/js-agent-start-function#cache) option:
    ```jsx
    <FingerprintProvider apiKey={'your-fpjs-public-api-key'} region={'eu'} web={{ cache: { storage: 'sessionStorage', duration: 'optimize-cost' } }}>
      <App />
    </FingerprintProvider>
    ```

**iOS**:
- Dropped support for **iOS 13**.

## Migration

**Provider**

```diff
- import { FingerprintJsProProvider } from '@fingerprintjs/fingerprintjs-pro-react-native'
+ import { FingerprintProvider } from '@fingerprintjs/fingerprintjs-pro-react-native'

- <FingerprintJsProProvider apiKey="PUBLIC_API_KEY" region="eu">
+ <FingerprintProvider apiKey="PUBLIC_API_KEY" region="eu">
    <App />
- </FingerprintJsProProvider>
+ </FingerprintProvider>
```

**Hook (`useVisitorData`)**

```diff
- const { isLoading, error, data, getData } = useVisitorData()
+ const { isLoading, isFetched, error, data, getData } = useVisitorData()

  // positional args + opt-in throwing → single options object, always throws
- await getData({ userAction: 'login' }, 'user_1234', { timeout: 5000, throwOnError: true })
+ await getData({ tags: { userAction: 'login' }, linkedId: 'user_1234', timeout: 5000 })

- data?.visitorId
- data?.confidence.score
+ data?.visitor_id
+ data?.suspect_score
```

**Imperative client**

```diff
- import { FingerprintJsProAgent } from '@fingerprintjs/fingerprintjs-pro-react-native'
+ import { start } from '@fingerprintjs/fingerprintjs-pro-react-native'

- const client = new FingerprintJsProAgent({ apiKey: 'PUBLIC_API_KEY', region: 'eu' })
- const visitorId = await client.getVisitorId()
- const data = await client.getVisitorData()
+ const fp = start({ apiKey: 'PUBLIC_API_KEY', region: 'eu' })
+ const result = await fp.get()
+ result.visitor_id
```

**Provider / start options**

```diff
  {
    apiKey: 'PUBLIC_API_KEY',
    region: 'eu',
-   endpointUrl: 'https://metrics.example.com',
-   fallbackEndpointUrls: ['https://metrics2.example.com'],
+   endpoints: ['https://metrics.example.com', 'https://metrics2.example.com'],
-   extendedResponseFormat: true,
-   allowUseOfLocationData: true,
-   locationTimeoutMillisAndroid: 5000,
+   android: { allowUseOfLocationData: true, locationTimeoutMillis: 5000 },
+   ios: { allowUseOfLocationData: true },
  }
```

**Errors**

```diff
- import { TooManyRequestError } from '@fingerprintjs/fingerprintjs-pro-react-native'
+ import { isFingerprintError } from '@fingerprintjs/fingerprintjs-pro-react-native'

  try {
    await fp.get()
  } catch (error) {
-   if (error instanceof TooManyRequestError) {
+   if (isFingerprintError(error) && error.code === 'too_many_requests') {
      // handle rate limiting
    }
  }
```

**Web peer dependency**

```diff
- npm install @fingerprintjs/fingerprintjs-pro-spa
+ npm install @fingerprint/agent
```

---