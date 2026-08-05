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

    @objc(configure:pluginVersion:extendedResponseFormat:fallbackEndpointUrls:allowUseOfLocationData:locationTimeoutMillis:region:endpointUrl:)
    public func configure(_ apiToken: String, _ pluginVersion: String, _ extendedResponseFormat: Bool, _ fallbackEndpointUrls: [String], _ allowUseOfLocationData: Bool, _ locationTimeoutMillis: Double, _ region: String?, _ endpointUrl: String?) -> Void {
        let region = RNFingerprintjsPro.parseRegion(region, endpoint: endpointUrl, endpointFallbacks: fallbackEndpointUrls)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: extendedResponseFormat, allowUseOfLocationData: allowUseOfLocationData)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }

    @objc(getVisitorId:linkedId:timeout:resolve:reject:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
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

        // A negative sentinel means "no timeout" (see the JS spec).
        if timeout >= 0 {
            fpjsClient?.getVisitorId(metadata, timeout: timeout / 1000, completion: completionHandler)
        } else {
            fpjsClient?.getVisitorId(metadata, completion: completionHandler)
        }
    }

    @objc(getVisitorData:linkedId:timeout:resolve:reject:)
    public func getVisitorData(tags: [String: Any]?, linkedId: String?, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
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

        // A negative sentinel means "no timeout" (see the JS spec).
        if timeout >= 0 {
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
