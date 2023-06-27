//
//  RNFingerprintjsPro.swift
//  RNFingerprintjsPro
//
//  Created by Denis Evgrafov on 01.02.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//
import FingerprintPro

@objc(RNFingerprintjsPro)
class RNFingerprintjsPro: NSObject {
    private var fpjsClient: FingerprintClientProviding?

    override init() {
        super.init()
    }

    @objc
    static func requiresMainQueueSetup() -> Bool { false }

    @objc(init:region:endpoint:extendedResponseFormat:pluginVersion:)
    public required init(_ apiToken: String, _ region: String? = "us", _ endpoint: String? = nil, _ extendedResponseFormat: Bool = false, _ pluginVersion: String) {
        let region = RNFingerprintjsPro.parseRegion(region, endpoint: endpoint)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: extendedResponseFormat)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }

    @objc(getVisitorId:linkedId:resolve:rejecter:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tags)
        fpjsClient?.getVisitorId(metadata) { result in
            switch result {
            case let .failure(error):
                let description = error.reactDescription
                reject("Error: ", description, error)
            case let .success(visitorId):
                // Prevent fraud cases in your apps with a unique
                // sticky and reliable ID provided by FingerprintJS Pro.
                resolve(visitorId)
            }
        }
    }

    @objc(getVisitorData:linkedId:resolve:rejecter:)
        public func getVisitorData(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tags)
            fpjsClient?.getVisitorIdResponse(metadata) { result in
                switch result {
                case let .failure(error):
                    let description = error.reactDescription
                    reject("Error: ", description, error)
                case let .success(visitorDataResponse):
                    let tuple = [
                        visitorDataResponse.requestId,
                        visitorDataResponse.confidence,
                        visitorDataResponse.asJSON()
                    ] as [Any]
                    resolve(tuple)
                }
            }
        }


    private static func parseRegion(_ passedRegion: String?, endpoint: String?) -> Region {
        var region: Region
        switch passedRegion {
        case "eu":
            region = .eu
        case "ap":
            region = .ap
        default:
            region = .global
        }

        if let endpointString = endpoint {
            region = .custom(domain: endpointString)
        }

        return region
    }

    private static func prepareMetadata(_ linkedId: String?, tags: Any?) -> Metadata {
        var metadata = Metadata(linkedId: linkedId)
        guard
            let tags = tags,
            let jsonTags = JSONTypeConvertor.convertObjectToJSONTypeConvertible(tags)
        else {
            return metadata
        }

        if let dict = jsonTags as? [String: JSONTypeConvertible] {
            dict.forEach { key, jsonType in
                metadata.setTag(jsonType, forKey: key)
            }
        } else {
            metadata.setTag(jsonTags, forKey: "tag")
        }

        return metadata
    }
}
