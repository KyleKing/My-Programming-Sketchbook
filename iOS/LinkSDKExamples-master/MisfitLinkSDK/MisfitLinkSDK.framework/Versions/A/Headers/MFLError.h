//
//  MFLError.h
//  MFLButtonSDK
//
//  Created by ASeign on 7/30/15.
//  Copyright (c) 2015 Misfit. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, MFLErrorCode)
{
    MFLUnknowError,
    MFLUserCancelledError,
    MFLInvalidAppInfoError,
    MFLCommandNotSupportedError,
    MFLNoValidDeviceSelectedError,
    MFLGestureSettingCancelledError,
    MFLSessionNotEnabledError,
    MFLLinkAppNotInstallError,
};

@interface MFLError : NSError


@end
