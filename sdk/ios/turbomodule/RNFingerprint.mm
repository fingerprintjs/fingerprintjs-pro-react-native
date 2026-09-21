#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNFingerprint, NSObject)

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
// `NativeRNFingerprintSpecJSI` invokes.
#import <RNFingerprintSpec/RNFingerprintSpec.h>

@interface RNFingerprint (TurboModule) <NativeRNFingerprintSpec>
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params;
@end

@implementation RNFingerprint (TurboModule)
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeRNFingerprintSpecJSI>(params);
}
@end
