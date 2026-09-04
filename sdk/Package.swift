// swift-tools-version: 6.0
//
// Swift Package Manager manifest for
// @fingerprintjs/fingerprintjs-pro-react-native, consumed by React Native
// 0.87's experimental SwiftPM autolinking (`npx react-native spm`).
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS IS HAND-WRITTEN (not produced by `react-native spm scaffold`)
// ─────────────────────────────────────────────────────────────────────────────
// The scaffolder SKIPS this library ("skipped-mixed-language"): ios/ mixes Swift
// and Objective-C++, and a single SwiftPM target cannot contain both languages
// (SE-0403 would lift this but is not shipped). The ObjC++ file is unavoidable —
// RN 0.87 has no Swift path for the TurboModule `getTurboModule:` step, which
// must return the codegen'd C++ JSI spec. The supported workaround is the
// two-target split below: a pure-Swift target plus a thin ObjC++ glue target
// that depends on it.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  NOT YET VALIDATED BY A REAL BUILD
// ─────────────────────────────────────────────────────────────────────────────
// RN's SwiftPM support is experimental ("do not use in production yet"). This
// manifest evaluates cleanly (`swift package dump-package`) but has NOT been
// exercised by an Xcode SwiftPM build in a consuming app. Confirm on a machine
// with Xcode + the e2e-app (via `npx react-native spm --deintegrate` then a
// detox build):
//   1. The Swift target resolves RCTPromise* via `import React` (RCT_SPM flag).
//   2. The Fingerprint v4 SwiftPM product/module identity below is correct.
//   3. The ObjC++ glue picks up FingerprintjsProReactNativeSwift-Swift.h.
//
// The React / React-GeneratedCode packages use RELATIVE paths that assume this
// manifest is reached through the autolinker's libs/FingerprintjsProReactNative
// symlink — the same fixed depth `react-native spm scaffold` targets. They are
// resolved from the CONSUMING APP, not this repo; do not repoint them here.

import PackageDescription

let package = Package(
    name: "FingerprintjsProReactNative",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "FingerprintjsProReactNative",
            targets: ["FingerprintjsProReactNative"]
        ),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        .package(
            url: "https://github.com/fingerprintjs/fingerprint-ios",
            from: "4.0.0"
        ),
    ],
    targets: [
        // Pure-Swift implementation: all business logic + the Fingerprint SDK
        // calls. Kept single-language so SwiftPM accepts the target.
        .target(
            name: "FingerprintjsProReactNativeSwift",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "Fingerprint", package: "fingerprintjs-pro-ios"),
            ],
            path: "ios",
            exclude: [
                "turbomodule",
                "RNFingerprintjsPro-Bridging-Header.h",
                "RNFingerprintjsPro.xcodeproj",
                "build",
            ],
            sources: [
                "FPJSError+React.swift",
                "JSONTypeConvertor.swift",
                "RNFingerprintjsPro.swift",
            ],
            swiftSettings: [.define("RCT_SPM")]
        ),
        // Objective-C++ TurboModule glue: registers the native module and returns
        // the codegen'd C++ JSI spec (`NativeRNFingerprintjsProSpecJSI`). This
        // cannot be Swift. Depends on the Swift target for its generated header.
        .target(
            name: "FingerprintjsProReactNative",
            dependencies: [
                "FingerprintjsProReactNativeSwift",
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: "ios/turbomodule",
            publicHeadersPath: ".",
            cSettings: [
                .headerSearchPath("."),
                .unsafeFlags(["-include", "react-native-spm-prefix.h"]),
            ],
            cxxSettings: [
                .headerSearchPath("."),
                .unsafeFlags(["-include", "react-native-spm-prefix.h"]),
                // Match the prebuilt React.framework's config-gated C++ ABI
                // (NDEBUG in Release), mirroring what `spm scaffold` emits.
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("CoreGraphics"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
