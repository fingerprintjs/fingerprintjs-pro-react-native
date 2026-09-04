---
'@fingerprintjs/fingerprintjs-pro-react-native': major
---

Dropped React Native Old Architecture support. The native module is now a TurboModule (New Architecture only) exposed via a Codegen spec. 

Migrated the project to [Strict Typescript API](https://reactnative.dev/docs/strict-typescript-api).

This is a breaking change: the SDK now requires React Native >= 0.80 (Expo SDK >= 54) with the [New Architecture](https://reactnative.dev/architecture/landing-page) enabled.
