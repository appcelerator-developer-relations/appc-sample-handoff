var log = require('log');
var moment = require('alloy/moment');

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

	if (e.activityType !== 'com.appcelerator.sample.handoff.watching') {
		return;
	}

	log.args('Ti.App.iOS:continueactivity', e);

	updateStatus('the continueactivity event was fired after continuing an activity from Apple Watch. See the logs for the payload.');

	// Make our tab active
	$.tab.active = true;
}

function updateStatus(text) {
	$.status.text = 'At ' + moment().format('HH:mm:ss.SS') + ' ' + text;
}
