#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNFingerprintjsPro, NSObject)

RCT_EXTERN_METHOD(init:(NSString *)apiToken region:(NSString *)region endpoint:(NSString *)endpointUrl)
RCT_EXTERN_METHOD(getVisitorId:(NSDictionary *)tags linkedId:(NSString *)linkedId resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
