define([
	'jquery',
	'underscore',
	'views/BaseListItemView',
	'models/ExplorationModel',
	'text!templates/admin/explorationListItemTemplate.html'
], function($, _, BaseListItemView, ExplorationModel, explorationListItemTemplate){
	
	var LinkListItemView = BaseListItemView.extend({
		
		editView : false, //set to true when editing;
		
		events: {
			"click .edit": "_onEditClick",
			"click .show": "_onShowClick",
			"click .records": "_onRecordsClick"
		},
		

		render: function() {
			
			var compiledTemplate = _.template( explorationListItemTemplate, { exploration: this.model.toJSON() } );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			return this;
		},
		
		_onEditClick: function() {
			window.location.href = "#admin/exploration/"+this.model.get('id');
		},
		
		_onShowClick: function() {
			window.location.href = "#exploration/"+this.model.get('id');
		},
		
		_onRecordsClick: function() {
			window.location.href = "#admin/records/"+this.model.get('id');
		},
		
	});
	// Our module now returns our view
	return LinkListItemView;
	
});