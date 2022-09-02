package com.fingerprintjs.reactnative

import com.facebook.react.bridge.*
import com.fingerprintjs.android.fpjs_pro.Configuration
import com.fingerprintjs.android.fpjs_pro.FingerprintJS
import com.fingerprintjs.android.fpjs_pro.FingerprintJSFactory
import java.lang.Exception


class RNFingerprintjsProModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var fpjsClient: FingerprintJS? = null

  override fun getName(): String {
    return "RNFingerprintjsPro"
  }

  @ReactMethod
  fun init(apiToken: String, regionKey: String?, endpointUrl: String?) {
    val factory = FingerprintJSFactory(reactApplicationContext)
    val region = when(regionKey) {
      "eu" -> Configuration.Region.EU
      "us" -> Configuration.Region.US
      "ap" -> Configuration.Region.AP
      else -> Configuration.Region.US
    }
    val configuration = Configuration(apiToken, region = region, endpointUrl = endpointUrl ?: region.endpointUrl)
    fpjsClient = factory.createInstance(configuration)
  }

  @ReactMethod
  fun getVisitorId(tags: ReadableMap?, linkedId: String?, promise: Promise) {
    try {
      fpjsClient?.getVisitorId(
        tags = tags?.toHashMap() ?: emptyMap(),
        linkedId = linkedId :? "",
        listener = { result -> promise.resolve(result.visitorId) },
        errorListener = { error -> promise.reject("Error: ", error.description) }
      )
    } catch (e: Exception) {
      promise.reject("Error: ", e)
    }
  }
}
