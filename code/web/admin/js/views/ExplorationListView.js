define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/ExplorationCollection',
	'text!templates/explorationListTemplate.html',
	'text!templates/explorationListItemTemplate.html'
], function($, _, BaseView, ExplorationCollection, explorationListTemplate, explorationListItemTemplate){
	
	var ExplorationListView = BaseView.extend({
		
		initialize: function() {
			
			this.collection = new ExplorationCollection();
			this.collection.fetch();
			
			//listen to collection changes
			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'reset', this.addAll);
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( explorationListTemplate, {} );
			this.$el.html( compiledTemplate );
			return this;
		},
		
		addAll: function() {
			this.collection.each(this.addOne);
		},
		
		addOne: function(model) {
			var compiledTemplate = _.template( explorationListItemTemplate, { exploration : model.toJSON() } );
			$('.explorationList').append(compiledTemplate);
		}
	});
	// Our module now returns our view
	return ExplorationListView;
	
});