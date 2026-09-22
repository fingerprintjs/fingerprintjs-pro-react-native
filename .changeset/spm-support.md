---
'@fingerprint/react-native': minor
---

Added experimental support for [Swift Package Manager](https://swift.org/package-manager/). The library now ships with its own `Package.swift`.

If you are on React Native >= 0.87, you can run:
```bash
cd ios
# deintegrate will remove CocoaPods from your project
npx react-native spm --deintegrate
```
to consume the library via Swift Package Manager.
