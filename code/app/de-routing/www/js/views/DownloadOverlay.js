define([
        'jquery',
        'underscore',
        'views/BaseOverlay',
        'text!templates/downloadOverlayTemplate.html'
], function($, _, BaseOverlay, downloadOverlayTemplate){
	
	var DownloadOverlay = BaseOverlay.extend({
		
		events : {
			'click a.cancel-dialog': '_onCancel',
			'click a.ok-dialog': '_onAccept',
		},
		
		initialize : function(options) {
			this.callback = options.callback;
			BaseOverlay.prototype.initialize.call(this);
		},
		
		render: function() {
			
			var compiledTemplate = _.template( downloadOverlayTemplate, {} );
			$(this.el).html( compiledTemplate );
			return this;
		},
		
		validate : function() {
			if ($('#explorationNumber').val() == "") {
				$('#explorationNumber').addClass('invalid');
				return false;
			}
			return true;
		},
	
		_onAccept: function() {
			if (!this.validate())
				return false;
			
			this.callback($('#explorationNumber').val());
			
			this.close();
			return false;
		},
		
		_onCancel: function() {
			
			this.callback(false);
			
			this.close();
			return false;
		}
	});
	return DownloadOverlay;

});