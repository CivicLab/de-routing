define([
	'jquery',
	'underscore',
	'views/BaseListItemView',
	'models/RecordModel',
	'text!templates/admin/recordListItemTemplate.html'
], function($, _, BaseListItemView, ExplorationModel, recordListItemTemplate){
	
	var RecordListItemView = BaseListItemView.extend({
		
		events: {
			"click .delete": "_onDeleteClick"
		},
		
		render: function() {
			
			var compiledTemplate = _.template( recordListItemTemplate, { record: this.model.toJSON() } );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			return this;
		},
		
		_onDeleteClick: function() {
			if (confirm('Do you really want to delete the record?')) { 
				this.model.destroy({
					error: function() {
						alert("Authentication failed.");
					}});	
			}
		}
		
	});
	// Our module now returns our view
	return RecordListItemView;
	
});