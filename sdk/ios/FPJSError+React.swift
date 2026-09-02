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
// snake_case error code.
extension FPError {
    var reactDescription: String {
        let description = self.localizedDescription
        switch self {
        case .invalidURL:
            return "invalid_url: \(description)"
        case .invalidURLParams:
            return "invalid_url_params: \(description)"
        case .apiError(let apiError):
            let code = apiError.reactCode("failed")
            let message = apiError.message ?? description
            return "\(code): \(message)"
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
    func reactCode(_ defaultCode: String) -> String {
        return self.errorDetails?.code?.rawValue ?? defaultCode
    }

    var message: String? {
        return self.errorDetails?.message
    }
}
