//
//  FPJSError+React.swift
//  RNFingerprintjsPro
//
//  Created by Petr Palata on 14.09.2022.
//

import Foundation
import Fingerprint

// The React Native layer collapses every error into a single `FingerprintError` carrying a
// machine-friendly `code` (see `sdk/src/errors.ts`). Native rejects with a `"<code>: <message>"`
// string that the JS `unwrapError` splits back apart, so the prefix here must be the API v4
// snake_case error code. Server errors also carry an event ID, which is appended to the prefix as
// `"<code>|<eventId>: <message>"` — error codes never contain `|`, so `unwrapError` can restore it
// into `FingerprintError.event_id` unambiguously.
extension FPError {
    var reactDescription: String {
        let description = self.localizedDescription
        switch self {
        case .invalidURL:
            return "invalid_url: \(description)"
        case .invalidURLParams:
            return "invalid_url_params: \(description)"
        case .apiError(let apiError):
            let message = apiError.message ?? description
            return "\(apiError.reactPrefix): \(message)"
        case .networkError(let networkError):
            return "network_error: \(networkError.localizedDescription)"
        case .jsonParsingError(let jsonParsingError):
            return "json_parsing_error: \(jsonParsingError.localizedDescription)"
        case .invalidResponseType:
            return "invalid_response_type: \(description)"
        case .clientTimeout:
            return "client_timeout: \(description)"
        case .unknownError:
            fallthrough
        @unknown default:
            return "unknown_error: \(description)"
        }
    }
}

extension APIError {
    // The rejection prefix: the canonical snake_case error code, plus the event ID the Server API
    // attached to the failed request, so `FingerprintError.event_id` is populated on iOS just like
    // it is on web.
    var reactPrefix: String {
        let eventId = self.eventId
        return eventId.isEmpty ? reactCode : "\(reactCode)|\(eventId)"
    }

    // The SDK's `APIError.Code` has no explicit raw values, so `rawValue` is the camelCase case name
    // (e.g. `tooManyRequests`). Map it to the canonical snake_case codes shared with Android and
    // `@fingerprint/agent` so `FingerprintError.code` is identical across platforms. Falls back to
    // the generic `failed` code when the server error carries no recognized code.
    var reactCode: String {
        guard let code = self.errorDetails?.code else {
            return "failed"
        }
        switch code {
        case .requestCannotBeParsed: return "request_cannot_be_parsed"
        case .requestReadTimeout: return "request_read_timeout"
        case .secretApiKeyRequired: return "secret_api_key_required"
        case .secretApiKeyNotFound: return "secret_api_key_not_found"
        case .publicApiKeyRequired: return "public_api_key_required"
        case .publicApiKeyNotFound: return "public_api_key_not_found"
        case .subscriptionNotActive: return "subscription_not_active"
        case .wrongRegion: return "wrong_region"
        case .featureNotEnabled: return "feature_not_enabled"
        case .visitorNotFound: return "visitor_not_found"
        case .tooManyRequests: return "too_many_requests"
        case .stateNotReady: return "state_not_ready"
        case .failed: return "failed"
        case .eventNotFound: return "event_not_found"
        case .missingModule: return "missing_module"
        case .payloadTooLarge: return "payload_too_large"
        case .serviceUnavailable: return "service_unavailable"
        case .rulesetNotFound: return "ruleset_not_found"
        case .invalidProxyIntegrationSecret: return "invalid_proxy_integration_secret"
        case .proxyIntegrationSecretEnvironmentMismatch: return "proxy_integration_secret_environment_mismatch"
        case .invalidProxyIntegrationHeaders: return "invalid_proxy_integration_headers"
        case .subscriptionRestricted: return "subscription_restricted"
        case .environmentRestricted: return "environment_restricted"
        case .subscriptionNotFound: return "subscription_not_found"
        case .installationMethodRestricted: return "installation_method_restricted"
        // A future SDK may add codes; fall back to the raw value rather than losing the information.
        @unknown default: return code.rawValue
        }
    }

    var message: String? {
        return self.errorDetails?.message
    }
}
