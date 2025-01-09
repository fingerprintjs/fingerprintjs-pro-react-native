#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNFingerprintjsPro, NSObject)

RCT_EXTERN_METHOD(init:(NSString *)apiToken
  region:(NSString *)region
  endpoint:(NSString *)endpointUrl
  endpointFallbacks:(NSArray<NSString *> *)fallbackEndpointUrls
  extendedResponseFormat:(BOOL)extendedResponseFormat
  pluginVersion:(NSString *)pluginVersion
)

RCT_EXTERN_METHOD(getVisitorId:(NSDictionary *)tags
  linkedId:(NSString *)linkedId
  resolve:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getVisitorIdWithTimeout:(NSDictionary *)tags
  linkedId:(NSString *)linkedId
  timeout:(nonnull NSNumber)timeout
  resolve:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getVisitorData:(NSDictionary *)tags
  linkedId:(NSString *)linkedId
  resolve:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getVisitorDataWithTimeout:(NSDictionary *)tags
  linkedId:(NSString *)linkedId
  timeout:(nonnull NSNumber)timeout
  resolve:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

@end
