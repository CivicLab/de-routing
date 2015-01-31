define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/ExplorationModel',
	'models/RecordCollection',
	'views/admin/RecordListItemView',
	'text!templates/admin/recordListTemplate.html'
], function($, _, BaseView, ExplorationModel, RecordCollection, RecordListItemView, recordListTemplate){
	
	var RecordListView = BaseView.extend({
		
		initialize: function(options) {
			var self = this;
			
			this.model = new ExplorationModel({id : options.id});
			this.model.fetch({success : function() {
				self.render();
			}});
			
			this.collection = new RecordCollection();
			
			//listen to collection changes
			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'reset', this.addAll);
			
			//load all the records
	        this.collection.fetch({
	            data: $.param({ exploration_id: this.model.get('id')})
	        });
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( recordListTemplate, { exploration : this.model.toJSON() } );
			this.$el.html( compiledTemplate );
			return this;
		},
		
		addAll: function() {
			this.collection.each(this.addOne);
		},
		
		addOne: function(model) {
			$('.no-records').hide();
			var subview = new RecordListItemView({model: model});
			this.append(subview,'.recordList');
		}
	});
	// Our module now returns our view
	return RecordListView;
	
});