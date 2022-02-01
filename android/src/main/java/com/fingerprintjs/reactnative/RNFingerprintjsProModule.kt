package com.fingerprintjs.reactnative

import com.facebook.react.bridge.*
import com.fingerprintjs.android.fpjs_pro.Configuration
import com.fingerprintjs.android.fpjs_pro.FPJSProClient
import com.fingerprintjs.android.fpjs_pro.FPJSProFactory
import java.lang.Exception


class RNFingerprintjsProModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var fpjsClient: FPJSProClient? = null

  override fun getName(): String {
    return "RNFingerprintjsPro"
  }

  @ReactMethod
  fun init(apiKey: String) {
    val factory = FPJSProFactory(reactApplicationContext)
    val configuration = Configuration(apiToken = apiKey, region = Configuration.Region.EU)
    fpjsClient = factory.createInstance(configuration)
  }

  @ReactMethod
  fun getVisitorId(promise: Promise) {
    try {
      fpjsClient?.getVisitorId(
        listener = { visitorId -> promise.resolve(visitorId) },
        errorListener = { error -> promise.reject("", error) }
      )
    } catch (e: Exception) {
      promise.reject("Error:", e)
    }
  }
}
