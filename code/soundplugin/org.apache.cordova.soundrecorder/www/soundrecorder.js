var exec = require('cordova/exec');

var soundRecorder = {
		open: function(successCallback, errorCallback, duration) {
			options = [{ "duration" : duration }];
			cordova.exec(successCallback, errorCallback, "SoundRecorder", "open", options);
		}
}

module.exports = soundRecorder;
