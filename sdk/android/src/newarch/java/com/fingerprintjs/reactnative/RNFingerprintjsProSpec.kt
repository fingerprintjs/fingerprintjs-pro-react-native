package com.fingerprintjs.reactnative

import com.facebook.react.bridge.ReactApplicationContext

/**
 * New-architecture base class. Extends the Codegen-generated `NativeRNFingerprintjsProSpec`
 * (produced from `src/specs/NativeRNFingerprintjsPro.ts`) so `RNFingerprintjsProModule` is a real
 * TurboModule. The generated class lives in this same package (see `codegenConfig.android
 * .javaPackageName` in `package.json`).
 */
abstract class RNFingerprintjsProSpec(reactContext: ReactApplicationContext) :
    NativeRNFingerprintjsProSpec(reactContext)
