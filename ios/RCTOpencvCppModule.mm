//
//  RCTOpencvCppModule.
//

#import "RCTOpencvCppModule.h"

@implementation OpencvCpp

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(createMessage,
                 withMessage:(NSString *)message
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = @(opencvcpp::createMessage(std::string([message UTF8String])).c_str());

    resolve(result);
}

@end
