//
//  RNFingerprintjsPro.swift
//  RNFingerprintjsPro
//
import Fingerprint
import Foundation

// Under the SwiftPM two-target split (Package.swift) this Swift target has no
// bridging header, so RCTPromiseResolveBlock/RCTPromiseRejectBlock must come from
// the React module. RCT_SPM is defined only by the SwiftPM Swift target; under
// CocoaPods these types arrive via the pod's Objective-C interop and this import
// is skipped.
#if RCT_SPM
import React
#endif

@objc(RNFingerprintjsPro)
class RNFingerprintjsPro: NSObject {
    private var fpjsClient: FingerprintClientProviding?

    @objc
    static func requiresMainQueueSetup() -> Bool { false }

    @objc(configure:pluginVersion:fallbackEndpointUrls:allowUseOfLocationData:locationTimeoutMillis:region:endpointUrl:)
    public func configure(_ apiToken: String, _ pluginVersion: String, _ fallbackEndpointUrls: [String], _ allowUseOfLocationData: Bool, _ locationTimeoutMillis: Double, _ region: String?, _ endpointUrl: String?) -> Void {
        let region = RNFingerprintjsPro.parseRegion(region, endpoint: endpointUrl, endpointFallbacks: fallbackEndpointUrls)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, allowUseOfLocationData: allowUseOfLocationData)
        fpjsClient = FingerprintFactory.getInstance(configuration)
    }

    @objc(getVisitorData:linkedId:timeout:resolve:reject:)
    public func getVisitorData(tag: [String: Any]?, linkedId: String?, timeout: NSNumber?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = RNFingerprintjsPro.prepareMetadata(linkedId, tags: tag)

        let completionHandler: Fingerprint.VisitorIdResponseBlock = { visitorIdResponseResult in
            switch visitorIdResponseResult {
            case let .success(visitorDataResponse):
                let visitorData: [String: Any] = [
                    "visitorId": visitorDataResponse.visitorId,
                    "eventId": visitorDataResponse.eventId,
                    "suspectScore": visitorDataResponse.suspectScore ?? -1,
                    "sealedResult": visitorDataResponse.sealedResult ?? "",
                ]
                resolve(visitorData)
            case .failure(let error):
                // Reject with the structured code/message, carrying the optional event ID through the
                // `NSError`'s `userInfo` — RN surfaces it as `error.code` / `error.userInfo.eventId`.
                var userInfo: [String: Any] = [:]
                if let eventId = error.reactEventId {
                    userInfo["eventId"] = eventId
                }
                let nsError = NSError(domain: "FingerprintPro", code: 0, userInfo: userInfo)
                reject(error.reactCode, error.reactMessage, nsError)
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
