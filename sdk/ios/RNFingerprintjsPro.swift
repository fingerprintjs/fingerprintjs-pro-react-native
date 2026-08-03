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

    @objc(configure:region:endpointUrl:fallbackEndpointUrls:extendedResponseFormat:pluginVersion:allowUseOfLocationData:locationTimeoutMillis:)
    public func configure(_ apiToken: String, _ region: String?, _ endpointUrl: String?, _ fallbackEndpointUrls: [String], _ extendedResponseFormat: Bool, _ pluginVersion: String, _ allowUseOfLocationData: Bool, _ locationTimeoutMillis: Double) -> Void {
        let region = RNFingerprintjsPro.parseRegion(region, endpoint: endpointUrl, endpointFallbacks: fallbackEndpointUrls)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: extendedResponseFormat, allowUseOfLocationData: allowUseOfLocationData)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }

    @objc(getVisitorId:linkedId:resolve:reject:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.getVisitorId(tags: tags, linkedId: linkedId, timeout: nil, resolve: resolve, reject: reject)
    }

    @objc(getVisitorIdWithTimeout:linkedId:timeout:resolve:reject:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.getVisitorId(tags: tags, linkedId: linkedId, timeout: NSNumber(value: timeout), resolve: resolve, reject: reject)
    }

    private func getVisitorId(tags: [String: Any]?, linkedId: String?, timeout: NSNumber?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
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

    @objc(getVisitorData:linkedId:resolve:reject:)
    public func getVisitorData(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.getVisitorData(tags: tags, linkedId: linkedId, timeout: nil, resolve: resolve, reject: reject)
    }

    @objc(getVisitorDataWithTimeout:linkedId:timeout:resolve:reject:)
    public func getVisitorData(tags: [String: Any]?, linkedId: String?, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.getVisitorData(tags: tags, linkedId: linkedId, timeout: NSNumber(value: timeout), resolve: resolve, reject: reject)
    }

    private func getVisitorData(tags: [String: Any]?, linkedId: String?, timeout: NSNumber?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tags)

        let completionHandler: FingerprintPro.VisitorIdResponseBlock = { visitorIdResponseResult in
            switch visitorIdResponseResult {
            case let .success(visitorDataResponse):
                let visitorData: [String: Any] = [
                    "requestId": visitorDataResponse.requestId,
                    "confidenceScore": visitorDataResponse.confidence,
                    "visitorDataJson": visitorDataResponse.asJSON(),
                    "sealedResult": visitorDataResponse.sealedResult ?? "",
                ]
                resolve(visitorData)
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
