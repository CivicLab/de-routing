define([
	'jquery',
	'underscore',
	'views/BaseView',
	'text!templates/explorationListTemplate.html'
], function($, _, BaseView, explorationListTemplate){
	
	var ExplorationListView = BaseView.extend({
		
		initialize: function() {
			// add events
			this.listenTo(this.collection, 'add', this.render);
			this.listenTo(this.collection, 'remove', this.render);
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( explorationListTemplate, {explorations: this.collection} );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			
			return this;
		}
	});
	// Our module now returns our view
	return ExplorationListView;
	
});