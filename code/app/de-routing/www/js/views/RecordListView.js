define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/RecordCollection',
	'text!templates/recordListTemplate.html'
], function($, _, BaseView, RecordCollection, recordListTemplate){
	
	var RecordListView = BaseView.extend({
		
		initialize: function() {
			//BaseView.prototype.initialize.call(this);
			
			//load data from local storage
			this.collection.syncData();
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			var compiledTemplate = _.template( recordListTemplate, {records: this.collection} );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			
			return this;
		},
		
	});
	// Our module now returns our view
	return RecordListView;
	
});