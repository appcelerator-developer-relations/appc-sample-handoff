- https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff
- https://developer.apple.com/library/prerelease/ios/documentation/Foundation/Reference/NSUserActivity_Class/
- http://docs.appcelerator.com/platform/latest/#!/guide/Handoff_User_Activities


- https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/AdoptingHandoff/AdoptingHandoff.html#//apple_ref/doc/uid/TP40014338-CH2-SW10
- Handoff is device to device, not via cloud (see image)

When the system needs the activity to be updated, such as before the activity is continued on another device, it calls the delegate’s userActivityWillSave: method. You can implement this callback to make updates to the object’s data-bearing properties such as userInfo, title, and so on. Once the system calls this method, it resets needsSave to NO. Change this value to YES if something happens that changes the userInfo or other data-bearing properties again.



# iOS Handoff Sample App

This sample app demonstrates how to use Handoff introduced in iOS 8 and supported by Titanium 5.0. Handoff lets you start using an application, such as editing a document, on one device, then transfer to another device to continue working on it.

![screenshots](docs/screenshots.png)

## Handoff Guide

For the complete details on how exactly Handoff works and how you can implement it in Titanium 5.0, check our guide: [Handoff User Activities](https://appcelerator.github.io/appc-docs/latest/#!/guide/Handoff_User_Activities).

## Handoff scenarios

* Handoff iOS app to iOS app
* Handoff iOS app to Web Browser (including desktop)
* [Handoff Web Browser to iOS app](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/AdoptingHandoff/AdoptingHandoff.html#//apple_ref/doc/uid/TP40014338-CH2-SW10)
* [Handoff Apple Watch App to iOS App or Web Browser](https://developer.apple.com/library/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/iOSSupport.html)
* [Handoff Apple Watch Glance to Apple Watch App](https://developer.apple.com/library/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/TheGlanceController.html#//apple_ref/doc/uid/TP40014969-CH16-SW4)

### Updating an activity's state for Handoff
Our sample app has another *UserActivity* tab to demonstrate another feature related to Handoff. While viewing information on one of the Beatles is as static as it gets, handoff is often used for activities that do change, like starting an email on your iPhone and continue it on your iPad.

At first sight the [useractivity.js](app/controllers/useractivity.js) controller is very similar to [detail.js](app/controllers/detail.js). Notice that time we did not use a *SearchableItemAttributeSet* to describe our activity but used the [subset of descriptors](http://docs.appcelerator.com/platform/latest/#!/api/Titanium.App.iOS.UserActivity-property-keywords) available directly via the UserActivity object. Search for *appsearch* in Spotlight and you should still find the activity but with no description or custom image this time.

Every time you make a change to the message in the TextArea, [we set](app/controllers/useractivity.js#L166) the activity's `needsSave` property to `true` to tell iOS we want to be able to update the activity state before it might be handed off to another device. For this, we've added a listener to the activity's `useractivitywillsave` event which you can find near [line #120](app/controllers/useractivity.js#L120). Here we simply update the `userInfo` property.

> **NOTE:** Just like `Ti.UI.View.font` you need to set the full `userInfo` object.

Just like we did for the Beatles we receive the handoff on the other by listening to the `continueactivity` event on [lines 18-42](app/controllers/useractivity.js#L18). Finally, the activity on the first device will receive the `useractivitywascontinued` event. This where you'd inform the user or maybe even lock the view to prevent further changes ([lines 140-146](app/controllers/useractivity.js#L140)).

They say a picture says more then 1000 lines of code:

![flowchart](docs/flowchart.png)

Give it a try! Install the sample app on two iOS 8+ devices, change the message on the first one, then double tap home or lock the other to request a handoff and continue the message there.

## Web Markup & Universal Links
Since our sample is not in the App Store I cannot demonstrate [how to combine](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/CombiningAPIs.html#//apple_ref/doc/uid/TP40016308-CH10-SW1) the UserActivity and Spotlight APIs with Web Markup and Universal Links. Fortunately, Apple has a [excellent guide](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/WebContent.html) on this topic. As discussed, our sample *does* show how to link a User Activity with a Spotlight item using `relatedUniqueIdentifier` and how to link both to a web activity using `webpageURL`. The rest... is up to you!

When you're done, use the [App Search API Validation Tool](https://search.developer.apple.com/appsearch-validation-tool).

## Links

* [Appcelerator Handoff User Activities Guide](http://docs.appcelerator.com/platform/latest/#!/guide/Handoff_User_Activities)
* [Apple Handoff Programming Guide](https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html)