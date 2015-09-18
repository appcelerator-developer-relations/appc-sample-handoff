//
//  InterfaceController.m
//  Handoff WatchApp Extension
//
//  Created by Appcelerator on 9/18/2015.
//  2015 by Appcelerator, Inc. All rights reserved.
//

#import "InterfaceController.h"

@interface InterfaceController()

@end


@implementation InterfaceController

- (void)awakeWithContext:(id)context {
    [super awakeWithContext:context];

    // Configure interface objects here.
}

- (void)willActivate {
    
    // This method is called when watch view controller is about to be visible to user
    [super willActivate];
    
    // Publish the activity of watching our WatchApp
    [self updateUserActivity:@"com.appcelerator.sample.handoff.watching"
                    userInfo:@{@"foo":@"bar"}
                  webpageURL:[NSURL URLWithString:@"http://www.appcelerator.com"]];
}

- (void)didDeactivate {
    
    // This method is called when watch view controller is no longer visible
    [super didDeactivate];
    
    // Invalidate our activity
    [self invalidateUserActivity];
}

@end
