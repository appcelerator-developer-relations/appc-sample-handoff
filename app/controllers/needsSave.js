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
	if (e.activityType !== 'com.appcelerator.sample.handoff.needssave') {
		return;
	}

	log.args('Ti.App.iOS:continueactivity', e);

	updateStatus('the continueactivity event was fired after continuing this activity from another device. The fields should be updated with that of the other device. See Console for details.');

	// Make our tab active
	$.tab.active = true;

	// Update our content with activity handed off to us
	$.win.title = e.title || '(untitled)';
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
		activityType: 'com.appcelerator.sample.handoff.needssave',

		title: $.title.value,

		// Custom payload a device will receive when it continues our activity
		userInfo: {
			body: $.body.value
		}
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	// Listen to event fired before our activity is continued on another device so we can update its state.
	activity.addEventListener('useractivitywillsave', onUseractivitywillsave);

	// Listen to event fired when our activity was continued on another device.
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

	activity.removeEventListener('useractivitywillsave', onUseractivitywillsave);
	activity.removeEventListener('useractivitywascontinued', onUseractivitywascontinued);

	activity.invalidate();
	activity = null;

	log.args('Ti.App.iOS.UserActivity#needsSave.invalidate()');
}

/**
 * Called before our activity is continued on another device so we can update its state.
 */
function onUseractivitywillsave(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywillsave', e);

	updateStatus('the useractivitywillsave event was fired. See Console for details.');

	activity.title = $.title.value;

	activity.userInfo = {
		body: $.body.value
	};

	log.args('Updated activity:', {
		title: activity.title,
		userInfo: activity.userInfo
	});
}

/**
 * Called when our activity was continued on another device.
 */
function onUseractivitywascontinued(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywascontinued', e);

	updateStatus('the useractivitywascontinued event was fired after continuing this activity on another device. The fields on the other device should now be updated with what you had up here. See Console for details.');
}

function onChanges(e) {

	$.win.title = $.title.value || '(untitled)';

	// Every (appropriate) time you set this to true the activity will receive
	// the useractivitywillsave event where you can then update the activity so
	// that when handed off, the other devices has the most recent information.
	activity.needsSave = true;

	log.args('Updated needsSave: true');

	// FIXME: https://jira.appcelerator.org/browse/TIMOB-19567
	// Currently, updating in useractivitywillsave might not always make it to the other device in time
	activity.title = $.title.value;
	activity.userInfo = {
		body: $.body.value
	};
}

/**
 * Helper function to show a timestamp and message in the UI.
 */
function updateStatus(text) {
	$.status.text = 'At ' + moment().format('HH:mm:ss.SS') + ' ' + text;
}
