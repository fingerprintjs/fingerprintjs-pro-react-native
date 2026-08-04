package com.fingerprintjs.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

/**
 * Old-architecture base class. Mirrors the method surface of the Codegen-generated
 * `NativeRNFingerprintjsProSpec` so `RNFingerprintjsProModule` can extend a single `...Spec` type
 * regardless of the architecture. The concrete implementation annotates the overrides with
 * `@ReactMethod` for the legacy bridge to pick them up.
 */
abstract class RNFingerprintjsProSpec(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  abstract fun configure(
      apiToken: String,
      pluginVersion: String,
      extendedResponseFormat: Boolean,
      fallbackEndpointUrls: ReadableArray,
      allowUseOfLocationData: Boolean,
      locationTimeoutMillis: Double,
      regionKey: String?,
      endpointUrl: String?
  )

  abstract fun getVisitorId(tags: ReadableMap?, linkedId: String?, timeout: Double?, promise: Promise)

  abstract fun getVisitorData(tags: ReadableMap?, linkedId: String?, timeout: Double?, promise: Promise)
}
