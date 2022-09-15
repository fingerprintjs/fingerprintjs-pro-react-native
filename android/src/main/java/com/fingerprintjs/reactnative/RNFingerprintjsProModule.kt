package com.fingerprintjs.reactnative

import com.facebook.react.bridge.*
import com.fingerprintjs.android.fpjs_pro.Configuration
import com.fingerprintjs.android.fpjs_pro.FingerprintJS
import com.fingerprintjs.android.fpjs_pro.FingerprintJSFactory
import com.fingerprintjs.android.fpjs_pro.Error
import com.fingerprintjs.android.fpjs_pro.ApiKeyRequired
import com.fingerprintjs.android.fpjs_pro.ApiKeyNotFound
import com.fingerprintjs.android.fpjs_pro.ApiKeyExpired
import com.fingerprintjs.android.fpjs_pro.RequestCannotBeParsed
import com.fingerprintjs.android.fpjs_pro.Failed
import com.fingerprintjs.android.fpjs_pro.RequestTimeout
import com.fingerprintjs.android.fpjs_pro.TooManyRequest
import com.fingerprintjs.android.fpjs_pro.OriginNotAvailable
import com.fingerprintjs.android.fpjs_pro.HeaderRestricted
import com.fingerprintjs.android.fpjs_pro.NotAvailableForCrawlBots
import com.fingerprintjs.android.fpjs_pro.NotAvailableWithoutUA
import com.fingerprintjs.android.fpjs_pro.WrongRegion
import com.fingerprintjs.android.fpjs_pro.SubscriptionNotActive
import com.fingerprintjs.android.fpjs_pro.UnsupportedVersion
import com.fingerprintjs.android.fpjs_pro.InstallationMethodRestricted
import com.fingerprintjs.android.fpjs_pro.ResponseCannotBeParsed
import com.fingerprintjs.android.fpjs_pro.NetworkError
import com.fingerprintjs.android.fpjs_pro.UnknownError
import java.lang.Exception


class RNFingerprintjsProModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var fpjsClient: FingerprintJS? = null

  override fun getName(): String {
    return "RNFingerprintjsPro"
  }

  @ReactMethod
  fun init(apiToken: String, regionKey: String?, endpointUrl: String?, extendedResponseFormat: Boolean, pluginVersion: String) {
    val factory = FingerprintJSFactory(reactApplicationContext)
    val region = when(regionKey) {
      "eu" -> Configuration.Region.EU
      "us" -> Configuration.Region.US
      "ap" -> Configuration.Region.AP
      else -> Configuration.Region.US
    }
    val integrationInfo = listOf(Pair("fingerprint-pro-react-native", pluginVersion))
    val configuration = Configuration(
      apiToken,
      region,
      endpointUrl = endpointUrl ?: region.endpointUrl,
      extendedResponseFormat,
      integrationInfo
    )
    fpjsClient = factory.createInstance(configuration)
  }

  @ReactMethod
  fun getVisitorId(tags: ReadableMap?, linkedId: String?, promise: Promise) {
    try {
      fpjsClient?.getVisitorId(tags?.toHashMap() ?: emptyMap(),
        linkedId ?: "",
        { result -> promise.resolve(result.visitorId) },
        { error -> promise.reject("Error: ", getErrorDescription(error))
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
        { error -> promise.reject("Error: ", getErrorDescription(error))
      })
    } catch (e: Exception) {
      promise.reject("Error: ", e)
    }
  }

  private fun getErrorDescription(error: Error): String {
    val errorType = when(error) {
      is ApiKeyRequired -> "ApiKeyRequired"
      is ApiKeyNotFound ->  "ApiKeyNotFound"
      is ApiKeyExpired -> "ApiKeyExpired"
      is RequestCannotBeParsed -> "RequestCannotBeParsed"
      is Failed -> "Failed"
      is RequestTimeout -> "RequestTimeout"
      is TooManyRequest -> "TooManyRequest"
      is OriginNotAvailable -> "OriginNotAvailable"
      is HeaderRestricted -> "HeaderRestricted"
      is NotAvailableForCrawlBots -> "NotAvailableForCrawlBots"
      is NotAvailableWithoutUA -> "NotAvailableWithoutUA"
      is WrongRegion -> "WrongRegion"
      is SubscriptionNotActive -> "SubscriptionNotActive"
      is UnsupportedVersion -> "UnsupportedVersion"
      is InstallationMethodRestricted -> "InstallationMethodRestricted"
      is ResponseCannotBeParsed -> "ResponseCannotBeParsed"
      is NetworkError -> "NetworkError"
      is UnknownError -> "UnknownError"
      else -> "UnknownError"
    }
    return errorType + ":" + error.description
  }
}
