//
//  AppDelegate.m
//  LapTimerTutorial
//
//  Created by Phillip Pasqual on 11/30/15.
//  Copyright © 2015 Misfit. All rights reserved.
// 

#import "AppDelegate.h"
#import <MisfitLinkSDK/MisfitLinkSDK.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    [[MFLSession sharedInstance] handleDidBecomeActive];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
    BOOL canHandle = NO;
    if ([[MFLSession sharedInstance] canHandleOpenUrl:url])
    {
        canHandle = [[MFLSession sharedInstance] handleOpenURL:url];
    }
    //other logic
    return canHandle;
}

@end
