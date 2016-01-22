//
//  SettingsViewController.m
//  LapTimerExample
//
//  Created by Phillip Pasqual on 12/1/15.
//  Copyright © 2015 misfitwearables. All rights reserved.
// 

#import "LTSettingsViewController.h"
#import <MisfitLinkSDK/MisfitLinkSDK.h>

@interface LTSettingsViewController ()

@end

@implementation LTSettingsViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.navigationController.navigationBarHidden = NO;
}


- (IBAction)onChangeButtonPressed:(UIButton *)sender
{
    [[MFLSession sharedInstance] showGestureMappingSettingDialogWithNavigationController:self.navigationController
                                                                              completion:^(NSDictionary * commandMappingDict, NSArray * supportedCommands, MFLError* error)
     {
         if (error)
         {
             return;
         }
         //Button Command Settings for the user.
         if (commandMappingDict)
         {
             MFLCommand *command = [commandMappingDict objectForKey:@(MFLGestureTypeTriplePress)];
             NSLog(@"command desc:%@, name:%@", command.desc, command.name);
         }
         for (NSDictionary *command in supportedCommands)
         {
             NSLog(@"supported command name:%@, desc: %@",command[@"name"],command[@"desc"]);
             
         }
     }];
}

@end