define([], function(){

	var AudioRecorder = function(errorCallback) {
		
		this.initialize = function() {
			this.recordTime = 0; // in miliseconds
			this.timer = null; // timer object
			this.state = 'empty';
			
			this.fileName = cordova.file.externalCacheDirectory + "myrecording.wav";
			this.mediaRecorder = new Media(this.fileName,null,errorCallback);
		};
		
		this.startRecording = function(progressCallback) {
			var self = this;
			
			if (self.timer == null && this.state == 'empty') {
				
				// start record
				this.mediaRecorder.startRecord();
				this.state = 'recording';
				self.timer = setInterval(function() {
					self.recordTime += 10;
					progressCallback(self.recordTime);
				},10)
			}
		};
		
		this.stopRecording = function() {
			
			if (this.timer != null) {
				clearInterval(this.timer);
				this.timer = null;
				
				if (this.mediaRecorder != null && this.state == 'recording')
					this.mediaRecorder.stopRecord();
					this.state = 'stopped';
			}
			
		};
		
		function playbackRecord(progressCallback) {
			if (this.mediaRecorder != null && this.state == 'stopped') {
				this.mediaRecorder.play();
				this.state = 'playback';
			}
		};
		
		function stopPlaybackRecord() {
			if (this.mediaRecorder != null && this.state == 'playback') {
				this.mediaRecorder.stop();
				this.state = 'stopped';
			}
		};
		
		function reject() {
			
		};
		
		function cleanUp() {
			
		};
		
		this.initialize();
	};
	
	return AudioRecorder;
});