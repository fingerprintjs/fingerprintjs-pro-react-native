#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNFingerprintjsPro, NSObject)

RCT_EXTERN_METHOD(configure:(NSString *)apiToken
  pluginVersion:(NSString *)pluginVersion
  fallbackEndpointUrls:(NSArray<NSString *> *)fallbackEndpointUrls
  allowUseOfLocationData:(BOOL)allowUseOfLocationData
  locationTimeoutMillis:(double)locationTimeoutMillis
  region:(NSString * _Nullable)region
  endpointUrl:(NSString * _Nullable)endpointUrl
)

RCT_EXTERN_METHOD(getVisitorData:(NSDictionary *)tag
  linkedId:(NSString *)linkedId
  timeout:(NSNumber * _Nullable)timeout
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

@end

// Expose the Swift class as a real TurboModule backed by the Codegen-generated spec. The Swift
// implementation already exposes the exact selectors the generated
// `NativeRNFingerprintjsProSpecJSI` invokes.
#import <RNFingerprintjsProSpec/RNFingerprintjsProSpec.h>

// Import the Swift-generated interface so the category below can extend the Swift class.
// The header name follows the Swift module: `RNFingerprintjsPro` under CocoaPods,
// `FingerprintjsProReactNativeSwift` under the SwiftPM two-target split (Package.swift).
#if __has_include("RNFingerprintjsPro-Swift.h")
#import "RNFingerprintjsPro-Swift.h"
#elif __has_include(<RNFingerprintjsPro/RNFingerprintjsPro-Swift.h>)
#import <RNFingerprintjsPro/RNFingerprintjsPro-Swift.h>
#else
#import <FingerprintjsProReactNativeSwift/FingerprintjsProReactNativeSwift-Swift.h>
#endif

@interface RNFingerprintjsPro (TurboModule) <NativeRNFingerprintjsProSpec>
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params;
@end

@implementation RNFingerprintjsPro (TurboModule)
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeRNFingerprintjsProSpecJSI>(params);
}
@end
