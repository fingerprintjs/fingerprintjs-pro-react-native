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

    @objc(configure:pluginVersion:fallbackEndpointUrls:allowUseOfLocationData:locationTimeoutMillis:region:endpointUrl:)
    public func configure(_ apiToken: String, _ pluginVersion: String, _ fallbackEndpointUrls: [String], _ allowUseOfLocationData: Bool, _ locationTimeoutMillis: Double, _ region: String?, _ endpointUrl: String?) -> Void {
        let region = RNFingerprintjsPro.parseRegion(region, endpoint: endpointUrl, endpointFallbacks: fallbackEndpointUrls)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        // TODO(v4): the `extendedResponseFormat` flag is removed in FingerprintPro v4 (the response is
        // always flat). While pinned to v2.17 we request the non-extended format explicitly.
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: false, allowUseOfLocationData: allowUseOfLocationData)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }

    @objc(getVisitorData:linkedId:timeout:resolve:reject:)
    public func getVisitorData(tag: [String: Any]?, linkedId: String?, timeout: NSNumber?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tag)

        let completionHandler: FingerprintPro.VisitorIdResponseBlock = { visitorIdResponseResult in
            switch visitorIdResponseResult {
            case let .success(visitorDataResponse):
                // TODO(v4): map from the flat `FingerprintResponse` — `eventId` replaces `requestId` and
                // a real `suspectScore` replaces the `-1` sentinel used here (v3 has no suspect score).
                let visitorData: [String: Any] = [
                    "visitorId": visitorDataResponse.visitorId,
                    "eventId": visitorDataResponse.requestId,
                    "suspectScore": -1,
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
