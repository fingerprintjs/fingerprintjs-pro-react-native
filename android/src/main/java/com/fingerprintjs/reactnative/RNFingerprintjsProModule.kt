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
  fun init(apiToken: String, regionKey: String?, endpointUrl: String?, extendedResponseFormat: Boolean) {
    val factory = FingerprintJSFactory(reactApplicationContext)
    val region = when(regionKey) {
      "eu" -> Configuration.Region.EU
      "us" -> Configuration.Region.US
      "ap" -> Configuration.Region.AP
      else -> Configuration.Region.US
    }
    val configuration = Configuration(apiToken, region = region, endpointUrl = endpointUrl ?: region.endpointUrl, extendedResponseFormat)
    fpjsClient = factory.createInstance(configuration)
  }

  @ReactMethod
  fun getVisitorId(tags: ReadableMap?, linkedId: String?, promise: Promise) {
    try {
      fpjsClient?.getVisitorId(tags?.toHashMap() ?: emptyMap(),
        linkedId ?: "",
        { result -> promise.resolve(result.visitorId) },
        { error -> promise.reject("Error: ", error.description)
      })
    } catch (e: Exception) {
        promise.reject("Error: ", e)
    }
  }

  @ReactMethod
  fun getVisitorData(tags: ReadableMap?, linkedId: String?, promise: Promise) {
    try {
      fpjsClient?.getVisitorId(tags?.toHashMap() ?: emptyMap(),
        linkedId ?: "",
        { result -> promise.resolve(Arguments.fromList(listOf(result.requestId, result.confidenceScore.score, result.asJson))) },
        { error -> promise.reject("Error: ", error.description)
        })
    } catch (e: Exception) {
      promise.reject("Error: ", e)
    }
  }
}
