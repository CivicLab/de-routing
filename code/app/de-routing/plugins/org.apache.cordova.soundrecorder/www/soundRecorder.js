cordova.define("de.drl.probetool.soundrecorder.soundRecorder", function(require, exports, module) {

	var soundRecorder = {
			open: function(successCallback, errorCallback, duration) {
				options = [{ "duration" : duration }];
				cordova.exec(successCallback, errorCallback, "SoundRecorder", "open", options);
			}
	}
	
	module.exports = soundRecorder;
});
