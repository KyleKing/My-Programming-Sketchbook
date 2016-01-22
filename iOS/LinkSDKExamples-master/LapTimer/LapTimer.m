//
//  LapTimer.m
//  QuantumDemo
//
//  Created by Phillip Pasqual on 12/1/15.
//  Copyright © 2015 Misfit. All rights reserved.
// 

#import "LapTimer.h"

@interface LapTimer()

@end

@implementation LapTimer
{
    NSTimeInterval lastRecordedTimeInterval;
    BOOL isTimerOn;
}


static LapTimer *_sharedInstance = nil;
+ (LapTimer *)sharedInstance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[LapTimer alloc] init];
    });
    return _sharedInstance;
}

- (id)init
{
    self = [super init];
    if (self)
    {
        isTimerOn = NO;
        self.lapTimes = [[NSMutableArray alloc] init];
        self.numLaps = 0;
    }
    return self;
}

- (void)start
{
    isTimerOn = YES;
    lastRecordedTimeInterval = [NSDate timeIntervalSinceReferenceDate];
    [self update];
}

- (void)newLap
{
    if (!isTimerOn) {
        [self start];
    }else{
        [self.lapTimes addObject:[NSNumber numberWithDouble:_elapsedTime]];
        self.numLaps++;
        self.elapsedTime = 0.0;
    }
}

- (void)update
{
    if (!isTimerOn) {
        return;
    }
    
    NSTimeInterval curTimeInterval = [NSDate timeIntervalSinceReferenceDate];
    self.elapsedTime += curTimeInterval - lastRecordedTimeInterval;
    lastRecordedTimeInterval = curTimeInterval;
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self performSelector:@selector(update) withObject:self afterDelay:0.1];
    });
}

- (void)stop
{
    isTimerOn = NO;
}

- (void)reset
{
    [self stop];
    [self.lapTimes removeAllObjects];
    self.numLaps = 0;
    self.elapsedTime = 0.0;
}


@end

