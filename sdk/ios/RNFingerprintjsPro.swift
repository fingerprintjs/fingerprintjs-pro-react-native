//
//  RNFingerprintjsPro.swift
//  RNFingerprintjsPro
//
import FingerprintPro

@objc(RNFingerprintjsPro)
class RNFingerprintjsPro: NSObject {
    private var fpjsClient: FingerprintClientProviding?

    @objc
    static func requiresMainQueueSetup() -> Bool { false }

    @objc(configure:region:endpoint:endpointFallbacks:extendedResponseFormat:pluginVersion:allowUseOfLocationData:locationTimeoutMillis:)
    public func configure(_ apiToken: String, _ region: String? = "us", _ endpoint: String?, _ endpointFallbacks: [String] = [], _ extendedResponseFormat: Bool = false, _ pluginVersion: String, allowUseOfLocationData: Bool = false, locationTimeoutMillis: NSNumber?) -> Void {
        let region = RNFingerprintjsPro.parseRegion(region, endpoint: endpoint, endpointFallbacks: endpointFallbacks)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: extendedResponseFormat, allowUseOfLocationData: allowUseOfLocationData)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }

    @objc(getVisitorId:linkedId:resolve:rejecter:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.getVisitorId(tags: tags, linkedId: linkedId, timeout: nil, resolve: resolve, reject: reject)
    }

    @objc(getVisitorIdWithTimeout:linkedId:timeout:resolve:rejecter:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, timeout: NSNumber?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tags)

        let completionHandler: FingerprintPro.VisitorIdBlock = { visitorIdResult in
            switch visitorIdResult {
            case .success(let visitorId):
                resolve(visitorId)
            case .failure(let error):
                let description = error.reactDescription
                reject("Error: ", description, error)
            }
        }

        if let timeout = timeout?.doubleValue {
            fpjsClient?.getVisitorId(metadata, timeout: timeout / 1000, completion: completionHandler)
        } else {
            fpjsClient?.getVisitorId(metadata, completion: completionHandler)
        }
    }

    @objc(getVisitorData:linkedId:resolve:rejecter:)
    public func getVisitorData(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.getVisitorData(tags: tags, linkedId: linkedId, timeout: nil, resolve: resolve, reject: reject)
    }

    @objc(getVisitorDataWithTimeout:linkedId:timeout:resolve:rejecter:)
    public func getVisitorData(tags: [String: Any]?, linkedId: String?, timeout: NSNumber?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tags)

        let completionHandler: FingerprintPro.VisitorIdResponseBlock = { visitorIdResponseResult in
            switch visitorIdResponseResult {
            case let .success(visitorDataResponse):
                let tuple = [
                    visitorDataResponse.requestId,
                    visitorDataResponse.confidence,
                    visitorDataResponse.asJSON(),
                    visitorDataResponse.sealedResult,
                ] as [Any]
                resolve(tuple)
            case .failure(let error):
                let description = error.reactDescription
                reject("Error: ", description, error)
            }
        }

        if let timeout = timeout?.doubleValue {
            fpjsClient?.getVisitorIdResponse(metadata, timeout: timeout / 1000, completion: completionHandler)
        } else {
            fpjsClient?.getVisitorIdResponse(metadata, completion: completionHandler)
        }
    }


    private static func parseRegion(_ passedRegion: String?, endpoint: String?, endpointFallbacks: [String]) -> Region {
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
            region = .custom(domain: endpointString, fallback: endpointFallbacks)
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
