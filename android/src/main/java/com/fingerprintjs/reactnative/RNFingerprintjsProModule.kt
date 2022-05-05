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
  fun init(apiToken: String, regionKey: String?, endpointUrl: String?) {
    val factory = FPJSProFactory(reactApplicationContext)
    val region = when(regionKey) {
      "eu" -> Configuration.Region.EU
      "us" -> Configuration.Region.US
      else -> Configuration.Region.US
    }
    val configuration = Configuration(apiToken, region = region, endpointUrl = endpointUrl ?: region.endpointUrl)
    fpjsClient = factory.createInstance(configuration)
  }

  @ReactMethod
  fun getVisitorId(promise: Promise) {
    try {
      fpjsClient?.getVisitorId(
        listener = { visitorId -> promise.resolve(visitorId) },
        errorListener = { error -> promise.reject("Error: ", error) }
      )
    } catch (e: Exception) {
      promise.reject("Error: ", e)
    }
  }
}
