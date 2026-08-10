package com.fingerprintjs.reactnative

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.fingerprintjs.android.fpjs_pro.Configuration
import com.fingerprintjs.android.fpjs_pro.FingerprintJS
import com.fingerprintjs.android.fpjs_pro.FingerprintJSProResponse
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
import com.fingerprintjs.android.fpjs_pro.ClientTimeout
import com.fingerprintjs.android.fpjs_pro.UnknownError
import com.fingerprintjs.android.fpjs_pro.InvalidProxyIntegrationHeaders
import com.fingerprintjs.android.fpjs_pro.InvalidProxyIntegrationSecret
import com.fingerprintjs.android.fpjs_pro.ProxyIntegrationSecretEnvironmentMismatch
import java.lang.Exception


@ReactModule(name = RNFingerprintjsProModule.NAME)
class RNFingerprintjsProModule(reactContext: ReactApplicationContext) : NativeRNFingerprintjsProSpec(reactContext) {
  private var fpjsClient: FingerprintJS? = null

  override fun getName(): String {
    return NAME
  }

  override fun configure(
      apiToken: String,
      pluginVersion: String,
      fallbackEndpointUrls: ReadableArray,
      allowUseOfLocationData: Boolean,
      locationTimeoutMillis: Double,
      regionKey: String?,
      endpointUrl: String?
  ) {
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
      // TODO(v4): the `extendedResponseFormat` flag is removed in the Android SDK v4 (the response is
      // always flat). While pinned to v2.17 we request the non-extended format explicitly.
      extendedResponseFormat = false,
      fallbackEndpointUrls = fallbackEndpointUrls.toArrayList().filterIsInstance<String>(),
      integrationInfo,
      allowUseOfLocationData,
      locationTimeoutMillis.toLong()
    )
    fpjsClient = factory.createInstance(configuration)
  }

  override fun getVisitorData(tag: ReadableMap?, linkedId: String?, timeout: Double?, promise: Promise) {
    try {
      val callback = { result: FingerprintJSProResponse ->
        // TODO(v4): map from the flat `FingerprintResponse` — `eventId` replaces `requestId` and a
        // real `suspectScore` replaces the `-1` sentinel used here (v3 has no suspect score).
        val visitorData = Arguments.createMap().apply {
          putString("visitorId", result.visitorId)
          putString("eventId", result.requestId)
          putDouble("suspectScore", -1.0)
          putString("sealedResult", result.sealedResult ?: "")
        }
        promise.resolve(visitorData)
      }
      val errorCallback = { error: Error -> promise.reject("Error: ", getErrorDescription(error)) }
      val timeoutMillis = timeout?.toInt()

      if (timeoutMillis != null) {
        fpjsClient?.getVisitorId(timeoutMillis, getTags(tag), linkedId ?: "", callback, errorCallback)
      } else {
        fpjsClient?.getVisitorId(getTags(tag), linkedId ?: "", callback, errorCallback)
      }
    } catch (e: Exception) {
      promise.reject("Error: ", e)
    }
  }

  private fun getTags(tags: ReadableMap?): Map<String, Any> {
    return tags
      ?.toHashMap()
      ?.filterValues { it != null }
      ?.mapValues { it.value!! }
      ?: emptyMap()
  }

  // The React Native layer collapses every error into a single `FingerprintError` carrying a
  // machine-friendly `code` (see `sdk/src/errors.ts`). We reject with a `"<code>:<message>"` string
  // that the JS `unwrapError` splits back apart, so the prefix must be the API v4 snake_case code.
  //
  // TODO(v4): align these codes with the final Android SDK v4 error classes.
  private fun getErrorDescription(error: Error): String {
    val code = when(error) {
      is ApiKeyRequired -> "public_api_key_required"
      is ApiKeyNotFound -> "public_api_key_not_found"
      is ApiKeyExpired -> "public_api_key_expired"
      is RequestCannotBeParsed -> "request_cannot_be_parsed"
      is Failed -> "failed"
      is RequestTimeout -> "request_timeout"
      is TooManyRequest -> "too_many_requests"
      is OriginNotAvailable -> "origin_not_available"
      is HeaderRestricted -> "header_restricted"
      is NotAvailableForCrawlBots -> "not_available_for_crawl_bots"
      is NotAvailableWithoutUA -> "not_available_without_ua"
      is WrongRegion -> "wrong_region"
      is SubscriptionNotActive -> "subscription_not_active"
      is UnsupportedVersion -> "unsupported_version"
      is InstallationMethodRestricted -> "installation_method_restricted"
      is ResponseCannotBeParsed -> "response_cannot_be_parsed"
      is NetworkError -> "network_error"
      is ClientTimeout -> "client_timeout"
      is UnknownError -> "unknown_error"
      is InvalidProxyIntegrationHeaders -> "invalid_proxy_integration_headers"
      is InvalidProxyIntegrationSecret -> "invalid_proxy_integration_secret"
      is ProxyIntegrationSecretEnvironmentMismatch -> "proxy_integration_secret_environment_mismatch"
      else -> "unknown_error"
    }
    return code + ":" + error.description
  }

  companion object {
    const val NAME = "RNFingerprintjsPro"
  }
}
