define([
        'jquery',
        'underscore',
        'models/ExplorationCollection',
        'views/BaseOverlay',
        'text!templates/alertOverlayTemplate.html'
], function($, _, ExplorationCollection, BaseOverlay, alertOverlayTemplate){
	
	var AlertOverlay = BaseOverlay.extend({
		
		events : {
			'click a.cancel-dialog': '_onCancel',
			'click a.ok-dialog': '_onAccept',
		},
		
		initialize : function(options) {
			this.callback = options.callback;
			this.title = options.title;
			this.text = options.text;
			this.showRejectButton = options.showRejectButton || false;
			BaseOverlay.prototype.initialize.call(this);
		},
		
		render: function() {
			
			var compiledTemplate = _.template( alertOverlayTemplate, {title: this.title, text: this.text, showRejectButton: this.showRejectButton} );
			$(this.el).html( compiledTemplate );
			return this;
		},
	
		_onAccept: function() {
			this.callback(true);
			
			this.close();
			return false;
		},
		
		_onCancel: function() {
			this.callback(false);
			
			this.close();
			return false;
		}
	});
	// Our module now returns our view
	return AlertOverlay;

});