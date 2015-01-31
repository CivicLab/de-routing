define([
	'jquery',
	'underscore',
	'views/BaseOverlay',
	'helpers/AudioRecorder',
	'text!templates/audioRecordOverlayTemplate.html'
], function($, _, BaseOverlay, AudioRecorder, audioRecordOverlayTemplate){
	
	var AudioRecordOverlay = BaseOverlay.extend({
		
		audioRecorder : null,
		
		events: {
			'click .start-recording': '_onStartRecording',
			'click .stop-recording': '_onStopRecording'
		},
		
		initialize : function(options) {
			this.callback = options.callback;
			
			this.audioRecorder = new AudioRecorder(function() {
				//TODO: show audio record error
			});
			
			BaseOverlay.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( audioRecordOverlayTemplate, {} );
			$(this.el).html( compiledTemplate );
			return this;
		},
		
		_onStartRecording: function() {
			
			this.audioRecorder.startRecording(function(time) {
				$('.record-time').html(time+"ms");
			});
			
			return false;
		},
		
		_onStopRecording: function() {
			
			this.audioRecorder.stopRecording();
			
			return false;
		},
		
		show: function() {
			console.log("show blabla");
			BaseOverlay.prototype.show.call(this);
		}
		
	});
	// Our module now returns our view
	return AudioRecordOverlay;
	
});