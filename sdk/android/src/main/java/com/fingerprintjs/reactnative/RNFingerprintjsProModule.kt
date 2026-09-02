package com.fingerprintjs.reactnative

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.fingerprint.android.Configuration
import com.fingerprint.android.Fingerprint
import com.fingerprint.android.FingerprintException
import com.fingerprint.android.FingerprintFactory
import com.fingerprint.android.Error
import com.fingerprint.android.ApiKeyRequired
import com.fingerprint.android.ApiKeyNotFound
import com.fingerprint.android.ApiKeyExpired
import com.fingerprint.android.RequestCannotBeParsed
import com.fingerprint.android.Failed
import com.fingerprint.android.RequestTimeout
import com.fingerprint.android.TooManyRequest
import com.fingerprint.android.OriginNotAvailable
import com.fingerprint.android.HeaderRestricted
import com.fingerprint.android.NotAvailableForCrawlBots
import com.fingerprint.android.NotAvailableWithoutUA
import com.fingerprint.android.WrongRegion
import com.fingerprint.android.SubscriptionNotActive
import com.fingerprint.android.UnsupportedVersion
import com.fingerprint.android.InstallationMethodRestricted
import com.fingerprint.android.ResponseCannotBeParsed
import com.fingerprint.android.NetworkError
import com.fingerprint.android.ClientTimeout
import com.fingerprint.android.UnknownError
import com.fingerprint.android.InvalidProxyIntegrationHeaders
import com.fingerprint.android.InvalidProxyIntegrationSecret
import com.fingerprint.android.ProxyIntegrationSecretEnvironmentMismatch
import java.lang.Exception
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


@ReactModule(name = RNFingerprintjsProModule.NAME)
class RNFingerprintjsProModule(reactContext: ReactApplicationContext) : NativeRNFingerprintjsProSpec(reactContext) {
  private var fpjsClient: Fingerprint? = null

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
    val factory = FingerprintFactory(reactApplicationContext)
    val region = when(regionKey) {
      "eu" -> Configuration.Region.EU
      "us" -> Configuration.Region.US
      "ap" -> Configuration.Region.AP
      else -> Configuration.Region.US
    }
    val integrationInfo = listOf(Pair("fingerprint-pro-react-native", pluginVersion))
    val configuration = Configuration(
      apiKey = apiToken,
      region = region,
      endpointUrl = endpointUrl ?: region.endpointUrl,
      fallbackEndpointUrls = fallbackEndpointUrls.toArrayList().filterIsInstance<String>(),
      integrationInfo = integrationInfo,
      allowUseOfLocationData = allowUseOfLocationData,
      locationTimeoutMillis = locationTimeoutMillis.toLong()
    )
    fpjsClient = factory.createInstance(configuration)
  }

  override fun getVisitorData(tag: ReadableMap?, linkedId: String?, timeout: Double?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val tags = getTags(tag)
        val timeoutMillis = timeout?.toInt()
        val result = if (timeoutMillis != null) {
          fpjsClient?.getVisitorId(timeoutMillis, tags, linkedId ?: "")
        } else {
          fpjsClient?.getVisitorId(tags, linkedId ?: "")
        } ?: throw Exception("not_initialized: Fingerprint client is not initialized")

        val visitorData = Arguments.createMap().apply {
          putString("visitorId", result.visitorId)
          putString("eventId", result.eventId)
          putDouble("suspectScore", (result.suspectScore ?: -1).toDouble())
          putString("sealedResult", result.sealedResult ?: "")
        }
        promise.resolve(visitorData)
      } catch (e: FingerprintException) {
        promise.reject("Error: ", getErrorDescription(e.error))
      } catch (e: Exception) {
        promise.reject("Error: ", e)
      }
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
