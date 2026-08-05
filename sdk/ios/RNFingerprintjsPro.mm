#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNFingerprintjsPro, NSObject)

RCT_EXTERN_METHOD(configure:(NSString *)apiToken
  pluginVersion:(NSString *)pluginVersion
  extendedResponseFormat:(BOOL)extendedResponseFormat
  fallbackEndpointUrls:(NSArray<NSString *> *)fallbackEndpointUrls
  allowUseOfLocationData:(BOOL)allowUseOfLocationData
  locationTimeoutMillis:(double)locationTimeoutMillis
  region:(NSString * _Nullable)region
  endpointUrl:(NSString * _Nullable)endpointUrl
)

RCT_EXTERN_METHOD(getVisitorId:(NSDictionary *)tags
  linkedId:(NSString *)linkedId
  timeout:(double)timeout
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getVisitorData:(NSDictionary *)tags
  linkedId:(NSString *)linkedId
  timeout:(double)timeout
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

@end

#ifdef RCT_NEW_ARCH_ENABLED
// On the New Architecture, expose the Swift class as a real TurboModule backed by the
// Codegen-generated spec. The Swift implementation already exposes the exact selectors the
// generated `NativeRNFingerprintjsProSpecJSI` invokes.
#import <RNFingerprintjsProSpec/RNFingerprintjsProSpec.h>

// Import the Swift-generated interface so the category below can extend the Swift class.
#if __has_include("RNFingerprintjsPro-Swift.h")
#import "RNFingerprintjsPro-Swift.h"
#else
#import <RNFingerprintjsPro/RNFingerprintjsPro-Swift.h>
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
#endif
