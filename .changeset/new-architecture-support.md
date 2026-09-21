---
'@fingerprintjs/fingerprintjs-pro-react-native': major
---

Dropped React Native Old Architecture support. The native module is now a TurboModule (New Architecture only) exposed via a Codegen spec. 

This is a breaking change: the SDK now requires React Native >= 0.79 (Expo SDK >= 53) with the [New Architecture](https://reactnative.dev/architecture/landing-page) enabled.
