//
//  JSONTypeConvertor.swift
//  fpjs_pro_plugin
//
//  Created by Petr Palata on 23.08.2022.
//

import Foundation
import FingerprintPro

class JSONTypeConvertor {
    static func convertDictionaryToJSONTypeConvertible(_ dict: [String: Any]) -> [String: JSONTypeConvertible] {
        var jsonDict: [String: JSONTypeConvertible] = [:]
        dict.forEach { key, jsonValue in
            if let jsonTypeConvertible = convertObjectToJSONTypeConvertible(jsonValue) {
                jsonDict[key] = jsonTypeConvertible
            }
        }
        return jsonDict
    }

    static func convertObjectToJSONTypeConvertible(_ object: Any) -> JSONTypeConvertible? {
        if let intValue = object as? Int {
            return intValue
        } else if let stringValue = object as? String {
            return stringValue
        } else if let boolValue = object as? Bool {
            return boolValue
        } else if let dictValue = object as? [String: Any] {
            return convertDictionaryToJSONTypeConvertible(dictValue)
        } else if let arrayValue = object as? [Any] {
            return arrayValue.compactMap { convertObjectToJSONTypeConvertible($0) }
        } else {
            return nil
        }
    }
}
