---
'@fingerprintjs/fingerprintjs-pro-react-native': major
---

Migrated the SDK to Fingerprint API v4 and realigned the public API with `@fingerprint/react`. This is a breaking change on every platform (web, iOS, Android).

**Renamed API**

- `FingerprintJsProProvider` → `FingerprintProvider`.
- `FingerprintJsProAgent` (constructed with `new`) → `start(options)`, returning a client with a single `get(options)` method (`getVisitorId`/`getVisitorData` are removed).
- Added `useFingerprint()` to read the client from context.

**Single options object**

- `getData(tags, linkedId, options)` → `getData({ tag, linkedId, timeout })`. `tags` is renamed to `tag`.
- `useVisitorData` now returns a discriminated union (`data`/`isLoading`/`isFetched`/`error`) and `getData` always throws on error — the `throwOnError` option is removed. `immediate` defaults to `false`.

**Grouped provider/start options**

- Platform-only options are nested: `android` (`allowUseOfLocationData`, `locationTimeoutMillis`), `ios` (`allowUseOfLocationData`), `web` (`storageKeyPrefix`, `urlHashing`, `remoteControlDetection`, `cache`). `locationTimeoutMillisAndroid` moves to `android.locationTimeoutMillis`.
- `endpointUrl` + `fallbackEndpointUrls` are replaced by a single `endpoints` (string or string[]).

**snake_case response**

- The response is now the flat, snake_case `FingerprintResponse` (`visitor_id`, `event_id`, `suspect_score?`, `sealed_result`), matching the Server API v4 and JS agent. `requestId` → `event_id`, `confidence` → `suspect_score`, `sealedResult` → `sealed_result`. The nested extended fields (`ipLocation`, `firstSeenAt`, etc.) and the `extendedResponseFormat` option are removed (v4 always returns the flat format).

**Single error type**

- The ~28 error classes are replaced by a single `FingerprintError` (`{ name, code, event_id }`) plus an `isFingerprintError` type guard. Discriminate on `error.code` (e.g. `too_many_requests`).

**Web**

- The web implementation now uses `@fingerprint/agent` (v4) instead of `@fingerprintjs/fingerprintjs-pro-spa`. Install `@fingerprint/agent` as the web peer dependency.
