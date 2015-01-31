define([
        'jquery',
        'underscore',
        'views/BaseView',
        'text!templates/lightBoxViewTemplate.html'
], function($, _, BaseView, lightBoxViewTemplate){


	LightBoxView = BaseView.extend({

		className: 'lightbox',

		events: {
			'click a.close': 'close',
			'click img' : 'close'
		},

		initialize: function(options){

			if (!options.contentUrl)
				this.contentUrl = '';
			else
				this.contentUrl = options.contentUrl;

		},

		render:function () {

			//render everything and append
			var content = '<img src="'+this.contentUrl+'"/>'
			var compiledTemplate = _.template( lightBoxViewTemplate, { 'content' : content});
			this.$el.html( compiledTemplate );

			//hide element
			this.hide();

			//append to body
			$('body').append(this.el);

			return this;
		},

		show: function() {
			$(this.el).show();
			return this;
		},

		hide: function() {
			$(this.el).hide();
		},
		
		close: function() {
	        $(this.el).remove();
	    }
	});

	return LightBoxView;

});