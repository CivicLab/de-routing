define([
    'jquery',
	'underscore',
	'backbone',
	'views/BaseView'
], function($,_, Backbone,BaseView){
	var BaseOverlay = BaseView.extend({
		
		el : '',
		id: 'overlay',
		
		initialize: function(options) {

			this.visible = false;
			//this.parent = options.parent;
			
			//remove overlay element if already present
			if (( $( "#overlay" ).length))
				$('#overlay').remove();
			
			this.hide();
			
			BaseView.prototype.initialize.call(this);
		},
		
		show: function() {
			if (this.closed)
				this.close();
			
			this.visible = true;
			//this.render();
			//$(this.el).show();
			$('#container').append(this.render().el);
			$(this.el).show();
		},
		
		hide: function() {
			this.visible = false;
			$(this.el).hide();
			//$('#overlay').hide();
		},
		
	});
	return BaseOverlay;
});