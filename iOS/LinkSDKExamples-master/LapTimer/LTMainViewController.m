//
//  ViewController.m
//  LapTimerTutorial
//
//  Created by Phillip Pasqual on 11/30/15.
//  Copyright © 2015 Misfit. All rights reserved.
// 

#import "LTMainViewController.h"
#import "GradientBackground.h"
#import "LapTimer.h"
#import <MisfitLinkSDK/MisfitLinkSDK.h>

@interface LTMainViewController ()<MFLGestureCommandDelegate, MFLStateTrackingDelegate>

@end

@implementation LTMainViewController
{
    BOOL isTimerRunning;
    NSInteger lapNum;
    NSTimeInterval lapElapsedTime;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if (![[MFLSession sharedInstance] enabled]) {
        [self showConnectAlert];
    }
    
    //apply background gradient
    CAGradientLayer *bgLayer = [GradientBackground orangeGradient];
    bgLayer.frame = self.view.bounds;
    [self.view.layer insertSublayer:bgLayer atIndex:0];
    
    [MFLSession sharedInstance].gestureCommandDelegate = self;
    
    [[LapTimer sharedInstance] addObserver:self forKeyPath:@"elapsedTime" options:NSKeyValueObservingOptionNew context:nil];
    [[LapTimer sharedInstance] addObserver:self forKeyPath:@"numLaps" options:NSKeyValueObservingOptionNew context:nil];
}

- (void)viewWillAppear:(BOOL)animated
{
    self.navigationController.navigationBarHidden = YES;
}

#pragma mark - Timer Control
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context{
    
    if ([keyPath isEqualToString:@"elapsedTime"]) {
        NSLog(@"change: %@", change);
        float newVal = [[change valueForKey:NSKeyValueChangeNewKey] floatValue];
        NSString *strVal = @"";
        if (newVal < 10)
            strVal = @"0";
        [[NSOperationQueue mainQueue] addOperationWithBlock:^{
            [_timerLabel setText:[NSString stringWithFormat:@"%@%0.02f",strVal,newVal]];
        }];
    }else if ([keyPath isEqualToString:@"numLaps"]){
        [self updateLapTimes];
    }
}

- (void)updateLapTimes
{
    NSMutableArray *laps = [[LapTimer sharedInstance] lapTimes];
    int numLaps = (int)[laps count];
    NSNumber *lastLapTime = [laps lastObject];
    NSString *timeString = [NSString stringWithFormat:@"%.02f", [lastLapTime floatValue]];
    if (numLaps > 0) {
        NSString *newLine = [NSString stringWithFormat:@"%d | %@\n",numLaps,timeString];
        [[NSOperationQueue mainQueue] addOperationWithBlock:^{
            _lapTimesTextView.text = [_lapTimesTextView.text stringByAppendingString:newLine];
        }];
    }else{
        [[NSOperationQueue mainQueue] addOperationWithBlock:^{
            _lapTimesTextView.text = @"";
        }];
    }
}

#pragma mark - Misfit Auth
- (void)showConnectAlert
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Connect to Misfit"
                                                    message:@"You must be connected to Misfit to use this app."
                                                   delegate:self
                                          cancelButtonTitle:@"Cancel"
                                          otherButtonTitles:@"OK", nil];
    [alert show];
}

-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    
    
    if (buttonIndex == 1) {
        [self connectToMisfit];
    }
}

-(void)connectToMisfit
{
    [[MFLSession sharedInstance] enableWithAppId:@"43880" appSecret:@"PKbRDAg4yptCySRqptaCunOEpYHjI26V"
                                      completion:^(NSDictionary * commandMappingDict,NSArray * supportedCommands, MFLError* error)
     {
         if (error)
         {
             NSLog(@"Error: %@", error.description);
             //handle error.
             return;
         }
         
         for (MFLCommand * command in supportedCommands)
         {
             NSLog(@"supported command name:%@, desc: %@",command.name,command.desc);
         }
     }];
}

#pragma mark - Button Commands
- (void) performActionByCommand:(MFLCommand *)command
                     completion:(void (^)(MFLActionResultType result))completion{
    
    if ([command.name isEqualToString:@"newLap"])
    {
        NSLog(@"new lap");
        [[LapTimer sharedInstance] newLap];
        completion(MFLActionResultTypeSuccess);
    }
    else if ([command.name isEqualToString:@"stopTimer"])
    {
        NSLog(@"stop");
        [[LapTimer sharedInstance] stop];
        completion(MFLActionResultTypeSuccess);
    }
    else if ([command.name isEqualToString:@"resetTimer"])
    {
        NSLog(@"reset");
        [[LapTimer sharedInstance] reset];
        completion(MFLActionResultTypeSuccess);
    }
    else
    {
        completion(MFLActionResultTypeNotSet);
    }
    
}

#pragma mark - Device Status
- (void) onDeviceStateChangeWithState:(MFLDeviceState)state
                         serialNumber:(NSString *)serialNumber
{
    if (state == MFLDeviceStateUnavailable){
        _deviceStatusLabel.hidden = NO;
    }else if (state == MFLDeviceStateAvailable){
        _deviceStatusLabel.hidden = YES;
    }
}

#pragma mark - Service Status
- (void) onServiceStateChangeWithState:(MFLServiceState)state
{
    if (state == MFLServiceStateDisabled){
        [self showConnectAlert];
    }
}

@end
