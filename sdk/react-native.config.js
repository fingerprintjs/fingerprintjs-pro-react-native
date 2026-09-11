// Pin this library's Swift Package Manager module name for RN 0.87's SPM
// autolinking. Without an override the autolinker derives the name from the npm
// package (`FingerprintjsProReactNative`); we pin it to `RNFingerprintjsPro` to
// match the CocoaPods pod and the native module name. The autolinker uses this
// for its libs/<name> symlink and the product it references, so it must equal
// the product/package name declared in Package.swift.
module.exports = {
  spm: { name: 'RNFingerprintjsPro' },
}
