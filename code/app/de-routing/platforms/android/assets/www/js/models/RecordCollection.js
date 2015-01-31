define([
        'underscore',
        'backbone',
        'models/RecordModel'
], function(_, Backbone,RecordModel){
	
	RecordCollection = Backbone.Collection.extend({
		model: RecordModel,
		
		localStorage: new Backbone.LocalStorage("records"),
		
		fetched : false,
		
		syncData: function() {
			if (!this.fetched)
				this.fetch();
			this.fetched = true;
		}
	});
	
	return RecordCollection;
});