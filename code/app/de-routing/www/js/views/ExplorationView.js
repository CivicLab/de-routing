define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/ExplorationCollection',
	'models/RecordCollection',
	'models/RecordModel',
	'text!templates/explorationTemplate.html'
], function($, _, BaseView, ExplorationCollection, RecordCollection, RecordModel, explorationTemplate){
	
	var ExplorationView = BaseView.extend({
		
		events : {
			'click a.startExploration': '_onStartExploration'
		},
		
		initialize: function(options) {
			
			this.records = options.records;
			this.explorations = options.explorations;
			
			//load data from local storage
			this.records.syncData();
			this.explorations.syncData();
			this.model = this.explorations.get({id: this.id});
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			var compiledTemplate = _.template( explorationTemplate, {exploration: this.model } );
			this.$el.html( compiledTemplate );
			
			return this;
		},
		
		validate: function() {
			if ($('#explorerName').val()=="") {
				$('#explorerName').addClass('invalid');
				return false;
			}
			return true;
		},
		
		_onStartExploration: function() {
			if (!this.validate())
				return false;
			
			var explorer = $('#explorerName').val();
			var data = this.model.getExplorationData(explorer);
			
			var record = new RecordModel();
			record.createFromData(data);
			this.records.add(record);
			
			//save record to local storage
			record.save();
			
			window.location.hash = '#/walk/'+record.get('id');
			
			return false;
		},
		
	});
	// Our module now returns our view
	return ExplorationView;
	
});