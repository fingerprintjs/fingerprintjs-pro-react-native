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

    @objc(init:region:endpoint:)
    public required init(_ apiToken: String, _ region: String? = "us", _ endpoint: String? = nil) {
        let region = parseRegion(region, endpoint: endpoint)
        let configuration = Configuration(apiKey: apiToken, region: region)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }

    @objc(getVisitorId:resolve:rejecter:)
    public func getVisitorId(tags: [String: Any]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = prepareMetadata(nil, tags: tags)
        fpjsClient?.getVisitorId(metadata) { result in
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
    
    private func parseRegion(_ passedRegion: String?, endpoint: String?) -> Region {
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
    
    private func prepareMetadata(_ linkedId: String?, tags: Any?) -> Metadata? {
        guard
            let tags = tags,
            let jsonTags = JSONTypeConvertor.convertObjectToJSONTypeConvertible(tags)
        else {
            return nil
        }
        
        var metadata = Metadata(linkedId: linkedId)
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
