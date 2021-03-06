define([
        'jquery',
        'underscore',
        'backbone',
        'models/SubtaskModel',
        'models/SubtaskCollection',
        'models/GeoModel'
], function($, _, Backbone, SubtaskModel, SubtaskCollection, GeoModel){

	TaskModel = Backbone.Model.extend({    

		defaults : {
			selected : true,
			focused : false,
			title: "",
			text: "",
			subtasks : false,
			subtaskCollection: false,
			record: null,
			id: -1,
			briefing: ''
		},

		initialize: function(attributes,options) {

			var self = this;

			//create subtasks
			if (this.get('subtasks')) {
				var subtaskdata = this.get('subtasks');
				var subtaskCollection = new SubtaskCollection();
				_.each(subtaskdata, function(entry) {
					var subtaskModel = new SubtaskModel(entry);
					subtaskModel.setResultFilePath(self.get('record_id'));
					subtaskCollection.add(subtaskModel);
				})
				this.set({subtaskCollection : subtaskCollection});
			}

			//add events
			this.geoModel = null;
			this.on('change:selected', this.onSelectedChange, this);

		},

		getGeoModel: function() {

			if (!this.has('location') || this.get('location').longitude == undefined || this.get('location').latitude == undefined) {
				return false; 
			}
			var marker = {
					geoType: "Point",
					geoCoordinates: [ this.get('location').longitude, this.get('location').latitude ],
					properties: {
						"record_id": this.get('record_id'),
						"task_id": this.get('id'),
						"type" : "marker"
					},
					className: 'marker task'+this.get('id')+' record'+this.get('record_id')+' selected'
			}

			this.geoModel = new GeoModel(marker);
			return this.geoModel;
		},

		setFocused: function(focused) {
			this.set({focused : focused});
		},

		onSelectedChange: function() {
			if (this.geoModel && this.get('record'))
				this.geoModel.setVisibility(this.get('selected') && this.get('record').get('selected'));
		}

	});

	return TaskModel;

});
