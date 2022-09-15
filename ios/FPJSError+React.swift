//
//  FPJSError+React.swift
//  RNFingerprintjsPro
//
//  Created by Petr Palata on 14.09.2022.
//

import Foundation
import FingerprintPro

extension FPJSError {
    var reactDescription: String {
        let description = self.localizedDescription
        switch self {
        case .invalidURL:
            return "InvalidURL: \(description)"
        case .invalidURLParams:
            return "InvalidURLParams: \(description)"
        case .apiError(let apiError):
            let reactErrorName = apiError.reactName("apiError")
            let message = apiError.message ?? description
            return "\(reactErrorName): \(message)"
        case .networkError(let networkError):
            return "NetworkError: \(networkError.localizedDescription)"
        case .jsonParsingError(let jsonParsingError):
            return "JsonParsingError: \(jsonParsingError.localizedDescription)"
        case .invalidResponseType:
            return "InvalidResponseType: \(description)"
        case .unknownError:
            fallthrough
        @unknown default:
            return "UnknownError: \(description)"
        }
    }
}

extension APIError {
    func reactName(_ defaultName: String) -> String {
        let name = self.error?.code?.rawValue ?? defaultName
        return name.firstUppercased
    }
    
    var message: String? {
        return self.error?.message
    }
}

extension StringProtocol {
    var firstUppercased: String { prefix(1).uppercased() + dropFirst() }
}
