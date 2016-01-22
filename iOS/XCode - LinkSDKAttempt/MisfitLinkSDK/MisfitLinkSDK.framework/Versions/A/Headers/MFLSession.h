//
//  MFLSession.h
//  Quantum
//
//  Created by Guomin Li on 7/20/15.
//  Copyright (c) 2015 Misfit. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "MFLError.h"
#import "MFLCommand.h"

typedef void (^EnableButtonCompletion) (MFLError * error);
typedef void (^CurrentAppModeCompletion) (BOOL isCurrentMode,MFLError * error);

typedef void (^MFLCompletion) (NSDictionary * commandMappingDict,NSArray * supportedCommands, MFLError * error);


typedef NS_ENUM(NSInteger, MFLGestureType) {
    MFLGestureTypeUnknow,
    MFLGestureTypeSinglePress,
    MFLGestureTypeDoublePress,
    MFLGestureTypeTriplePress,
    MFLGestureTypeLongPress,
    MFLGestureTypeDoublePressNHold,
};

typedef NS_ENUM(NSInteger, MFLActionResultType) {
    MFLActionResultTypeNotSet,//未执行或未定义任何操作
    MFLActionResultTypeSuccess,//成功
    MFLActionResultTypeFail,//失败
} ;

typedef NS_ENUM(NSInteger, MFLDeviceState){
    MFLDeviceStateUnavailable,
    MFLDeviceStateAvailable
} ;

typedef NS_ENUM(NSInteger, MFLServiceState) {
    MFLServiceStateDisabled,
    MFLServiceStateEnabled
};

@protocol MFLGestureCommandDelegate <NSObject>

- (void) performActionByCommand:(MFLCommand *)command completion:(void (^)(MFLActionResultType result))completion;

@end

@protocol MFLStateTrackingDelegate <NSObject>

@optional
- (void) onDeviceStateChangeWithState:(MFLDeviceState)state
                         serialNumber:(NSString *)serialNumber;

- (void) onServiceStateChangeWithState:(MFLServiceState)state;

@end

@interface MFLSession : NSObject

@property (nonatomic, readonly) BOOL enabled;

@property (nonatomic, strong) id<MFLGestureCommandDelegate> gestureCommandDelegate;

@property (nonatomic, weak) id<MFLStateTrackingDelegate> stateTrackingDelegate;

+ (MFLSession *) sharedInstance;

- (void) enableWithAppId:(NSString *) appId appSecret:(NSString *) appSecret completion:(MFLCompletion) completion;

- (void) disable;

- (void) refreshStatus;

- (BOOL) handleOpenURL:(NSURL *) url;

- (BOOL) canHandleOpenUrl:(NSURL *) url;

- (void) handleDidBecomeActive;

- (void) updateCommandMappingByGestureType:(MFLGestureType)gestureType
                                   command:(NSString *)commandName
                                completion:(MFLCompletion) completion;

- (void)showGestureMappingSettingDialogWithNavigationController:(UINavigationController *)controller completion:(MFLCompletion) completion;

- (MFLCommand *) getCommandByGestureType:(MFLGestureType)gestureType;

- (BOOL) isMisfitLinkAppInstalled;

@end