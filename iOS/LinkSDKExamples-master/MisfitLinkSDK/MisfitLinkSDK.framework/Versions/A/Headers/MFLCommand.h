//
//  MFLCommand.h
//  Quantum
//
//  Created by Guomin Li on 8/10/15.
//  Copyright (c) 2015 Misfit. All rights reserved.
//
#import <Foundation/Foundation.h>

@interface MFLCommand : NSObject

@property (nonatomic, readonly, copy) NSString *name;
@property (nonatomic, readonly, copy) NSString *desc;

@end