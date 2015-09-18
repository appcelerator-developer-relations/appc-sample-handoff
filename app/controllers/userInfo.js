var log = require('log');
var moment = require('alloy/moment');

// Reference to the activity created so we can invalidate it
var activity;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	Ti.App.iOS.addEventListener('continueactivity', onContinueactivity);

})(arguments[0] || {});

/**
 * Called when our activity was continued on another device.
 */
function onContinueactivity(e) {

	// We only respond to the writing activity
	if (e.activityType !== 'com.appcelerator.sample.handoff.userinfo') {
		return;
	}

	log.args('Ti.App.iOS:continueactivity', e);

	updateStatus('the continueactivity event was fired after continuing an activity from search or another device. The message should be updated with that of the search index or other device. (see logs for details)');

	// Make our tab active
	$.tab.active = true;

	// Update the body with the state of the user activity as it was handed off
	$.title.value = e.title;
	$.body.value = e.userInfo.body;
}

/**
 * Called when our tab receives focus to create the user activity and
 * make it the current by calling becomeCurrent()
 */
function createUserActivity() {

	invalidateActivity();

	var parameters = {

		// This value needs to be defined in tiapp.xml
		activityType: 'com.appcelerator.sample.handoff.userinfo',

		title: 'New Document', // or take from TextField? Can we update it?

		// We'll receive this information when the activity is continued via handoff
		userInfo: {
			body: $.body.value
		}
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	// Listen to event fired if the activity context needs to be saved before being continued on another device
	activity.addEventListener('useractivitywillsave', onUseractivitywillsave);

	// Listen to event fired when the user activity was continued on another device.
	activity.addEventListener('useractivitywascontinued', onUseractivitywascontinued);

	// Check if the user's OS version supports user activities
	if (activity.supported) {

		// Make it the current activity
		activity.becomeCurrent();

	} else {
		log.args('Did not call becomeCurrent() because activity.supported is:', activity.supported);
	}
}

/**
 * Called when the user moves away from our tab so we can invalidate
 * the user activity. Once invalidated it cannot become current again!
 */
function invalidateActivity() {

	if (!activity) {
		return;
	}

	activity.removeEventListener('useractivitywillsave', onUseractivitywillsave);
	activity.removeEventListener('useractivitywascontinued', onUseractivitywascontinued);

	activity.invalidate();
	activity = null;

	log.args('Ti.App.iOS.UserActivity#userInfo.invalidate()');
}

/**
 * Called before our activity is continued on another device so we can update its state.
 */
function onUseractivitywillsave(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywillsave', e);

	updateStatus('the useractivitywillsave event was fired after setting needsSave to true. (see logs for details)');

	activity.title = $.title.value;

	activity.userInfo = {
		body: $.body.value
	};

	log.args('Updated activity.userInfo.body:', activity.userInfo.body);
}

/**
 * Called when our activity was continued on another device.
 */
function onUseractivitywascontinued(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywascontinued', e);

	updateStatus('the useractivitywascontinued event was fired after continuing this activity on another device. The body on the other device should now be what you had up here. (see logs for details)');
}

function onChanges(e) {

	$.win.title = $.title.value;

	// Every (appropriate) time you set this to true the activity will receive
	// the useractivitywillsave event where you can then update the activity so
	// that when handed off, the other devices has the most recent information.
	activity.needsSave = true;
}

/**
 * Helper function to show a timestamp and message in the UI.
 */
function updateStatus(text) {
	$.status.text = 'At ' + moment().format('HH:mm:ss.SS') + ' ' + text;
}
