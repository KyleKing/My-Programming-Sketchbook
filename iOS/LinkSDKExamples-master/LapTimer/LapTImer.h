//
//  LapTimer.h
//  QuantumDemo
//
//  Created by Phillip Pasqual on 12/1/15.
//  Copyright © 2015 Misfit. All rights reserved.
// 

#import <Foundation/Foundation.h>

@interface LapTimer : NSObject

@property (nonatomic, assign) NSTimeInterval elapsedTime;
@property (nonatomic, strong) NSMutableArray *lapTimes;
@property (nonatomic, assign) NSInteger numLaps;

+ (LapTimer *) sharedInstance;

- (void)newLap;
- (void)update;
- (void)stop;
- (void)reset;

@end