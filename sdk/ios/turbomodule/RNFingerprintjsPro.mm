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

// Pull in the Swift-generated interface WHEN the build exposes it (CocoaPods, or
// any SwiftPM config that puts …-Swift.h on this target's header search path).
// This import is opportunistic and must never hard-fail: under the SwiftPM
// two-target split some configurations don't expose a Swift target's generated
// header to a dependent ObjC++ target. That's fine: RCT_EXTERN_MODULE above
// already declared `@interface RNFingerprintjsPro : NSObject`, which is all the
// TurboModule category below needs to attach to the class. (The Swift methods
// are dispatched via the ObjC runtime, not through this header.)
#if __has_include("RNFingerprintjsPro-Swift.h")
#import "RNFingerprintjsPro-Swift.h"
#elif __has_include(<RNFingerprintjsPro/RNFingerprintjsPro-Swift.h>)
#import <RNFingerprintjsPro/RNFingerprintjsPro-Swift.h>
#elif __has_include(<RNFingerprintjsProSwift-Swift.h>)
#import <RNFingerprintjsProSwift-Swift.h>
#elif __has_include("RNFingerprintjsProSwift-Swift.h")
#import "RNFingerprintjsProSwift-Swift.h"
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
