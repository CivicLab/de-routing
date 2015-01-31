cordova.define("org.apache.cordova.soundrecorder.soundrecorder", function(require, exports, module) { var exec = require('cordova/exec');

var soundRecorder = {
		open: function(successCallback, errorCallback, duration) {
			options = [{ "duration" : duration }];
			cordova.exec(successCallback, errorCallback, "SoundRecorder", "open", options);
		}
}

module.exports = soundRecorder;

});
