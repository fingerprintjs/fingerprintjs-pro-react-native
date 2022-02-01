//
//  RNFingerprintjsPro.swift
//  RNFingerprintjsPro
//
//  Created by Denis Evgrafov on 01.02.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//
import FingerprintJSPro

@objc(RNFingerprintjsPro)
class RNFingerprintjsPro: NSObject {
    private var fpjsClient: FingerprintJSProClient?

    override init() {
        super.init()
    }

    @objc public required init(_ apiToken: String, _ region: String? = "us", _ endpoint: URL? = nil) {
        fpjsClient = FingerprintJSProFactory
            .getInstance(
                token: apiToken,
                endpoint: endpoint,
                region: region
            )
    }

    @objc(getVisitorId:rejecter:)
    public func getVisitorId(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        fpjsClient?.getVisitorId { result in
            switch result {
            case let .failure(error):
                reject("Error: ", error.localizedDescription, error)
            case let .success(visitorId):
                // Prevent fraud cases in your apps with a unique
                // sticky and reliable ID provided by FingerprintJS Pro.
                resolve(visitorId)
            }
        }
    }
}
