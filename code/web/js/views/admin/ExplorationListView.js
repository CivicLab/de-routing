define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/ExplorationCollection',
	'views/admin/ExplorationListItemView',
	'text!templates/admin/explorationListTemplate.html'
], function($, _, BaseView, ExplorationCollection, ExplorationListItemView, explorationListTemplate){
	
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
			$('.no-explorations').hide();
			var subview = new ExplorationListItemView({model: model});
			this.append(subview,'.explorationList');
		}
	});
	// Our module now returns our view
	return ExplorationListView;
	
});