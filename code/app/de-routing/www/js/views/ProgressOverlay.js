define([
        'jquery',
        'underscore',
        'views/BaseOverlay',
        'text!templates/progressOverlayTemplate.html'
], function($, _, BaseOverlay, progressOverlayTemplate){
	
	var ProgressOverlay = BaseOverlay.extend({
		
		events : {
			'click a.cancel-dialog': '_onCancel',
			'click a.ok-dialog': '_onAccept'
		},
		
		initialize : function(options) {
			this.title = options.title;
			this.text = options.text;
			this.callback = options.callback;
			this.setProgress(0);
			BaseOverlay.prototype.initialize.call(this);
		},
		
		render: function() {
			var compiledTemplate = _.template( progressOverlayTemplate, {text: this.text, title: this.title} );
			$(this.el).html( compiledTemplate );
			return this;
		},
		
		setProgress: function(progress) {
			$('#overlay .progressbar').width(progress*100+"%");
		},
		
		setFinished: function(msg,timeout) {
			var self = this;
	    	this.setProgress(1);
	    	
	    	$('#overlay .popup p').html(msg);
	    	
	    	$('.cancel-dialog.button').hide();
	    	$('.ok-dialog.button').show();
	    	
	    	if (timeout != null) {
	    		setTimeout(function() {
	    			self.close();
	    		},timeout);
	    	}
	    },
		
		_onCancel: function() {
			
			if (this.callback)
				this.callback(false);
			
			this.close();
			return false;
		},
		
		_onAccept: function() {
			if (this.callback)
			this.callback(true);
		
			this.close();
			return false;
		}
	});
	// Our module now returns our view
	return ProgressOverlay;

});