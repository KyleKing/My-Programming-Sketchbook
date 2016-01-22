//
//  GradientBackground.m
//  LapTimerExample
//
//  Created by Phillip Pasqual on 12/1/15.
//  Copyright © 2015 misfitwearables. All rights reserved.
// 

#import "GradientBackground.h"
#import <UIKit/UIKit.h>

@implementation GradientBackground

//Orange gradient background
+ (CAGradientLayer*) orangeGradient {
    
    UIColor *colorOne = [UIColor colorWithRed:(238/255.0)  green:(96/255.0)  blue:(42/255.0)  alpha:1.0];
    UIColor *colorTwo = [UIColor colorWithRed:(238/255.0) green:(136/255.0) blue:(30/255.0) alpha:1.0];
    
    NSArray *colors = [NSArray arrayWithObjects:(id)colorOne.CGColor, colorTwo.CGColor, nil];
    NSNumber *stopOne = [NSNumber numberWithFloat:0.0];
    NSNumber *stopTwo = [NSNumber numberWithFloat:1.0];
    
    NSArray *locations = [NSArray arrayWithObjects:stopOne, stopTwo, nil];
    
    CAGradientLayer *headerLayer = [CAGradientLayer layer];
    headerLayer.startPoint = CGPointMake(0.0, 1.0);
    headerLayer.endPoint = CGPointMake(1.0,0.0);
    headerLayer.colors = colors;
    headerLayer.locations = locations;
    
    return headerLayer;
}

@end