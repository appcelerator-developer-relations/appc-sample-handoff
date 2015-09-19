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

	if (e.activityType !== 'com.appcelerator.sample.handoff.writing') {
		return;
	}

	log.args('Ti.App.iOS:continueactivity', e);

	updateStatus('the continueactivity event was fired after continuing this activity from another device. See Console for details.');

	// Make our tab active
	$.tab.active = true;
}

/**
 * Called when our tab receives focus to create the user activity and
 * make it the current by calling becomeCurrent()
 */
function createUserActivity() {

	invalidateActivity();

	var parameters = {

		// This value needs to be defined in tiapp.xml
		activityType: 'com.appcelerator.sample.handoff.webpageurl',

		title: 'webpageURL',

		webpageURL: 'https://github.com/appcelerator-developer-relations/appc-sample-handoff/blob/master/app/controllers/webpageURL.js'
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	// Listen to event fired when our activity was continued on another device
	activity.addEventListener('useractivitywascontinued', onUseractivitywascontinued);

	// Check if the user's OS version supports user activities
	if (activity.supported) {

		// Make it the current activity
		activity.becomeCurrent();

	} else {
		$.status.text = 'Your iOS version does not support this activity.';
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

	activity.removeEventListener('useractivitywascontinued', onUseractivitywascontinued);

	activity.invalidate();
	activity = null;

	log.args('Ti.App.iOS.UserActivity#webpageurl.invalidate()');
}

/**
 * Called when our activity was continued on another device.
 */
function onUseractivitywascontinued(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywascontinued', e);

	updateStatus('the useractivitywascontinued event was fired after continuing this activity on another device. See Console for details.');
}

function updateStatus(text) {
	$.status.text = 'At ' + moment().format('HH:mm:ss.SS') + ' ' + text;
}
