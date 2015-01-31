define([
        'jquery',
        'underscore',
        'backbone',
        'values/constants',
        'models/TaskModel',
        'models/TaskCollection'
], function($, _, Backbone, CONSTANTS, TaskModel, TaskCollection){


	RecordModel = Backbone.Model.extend({    

		urlRoot : CONSTANTS.SETTING_WEB_SERVICE_URL+'/records/',

		geoModel : null,

		defaults : {
			focused : false,
			selected : true,
			tasks : [],
			route : [],

			taskCollection : new TaskCollection, //holds the task collection

		},

		initialize: function() {
			var self = this;

			this.on('change:selected', function() {
				if (self.geoModel)
					self.geoModel.setVisibility(self.get('selected'));

				this.get('taskCollection').each(function(task) {
					task.onSelectedChange();
				});
			});
			
			this._createTaskCollection();
		},

		//TODO move this to setter method
		_createTaskCollection: function() {
			taskdata = this.get('tasks');
			var tasks = [];
			for (var i=0;i<taskdata.length;i++) {
				taskdata[i].record_id = this.get('id');
				taskdata[i].record = this;
				var task = new TaskModel(taskdata[i]);
				tasks.push(task);
			}
			this.set({taskCollection : new TaskCollection(tasks)});
		},
		
		getGeoModel: function() {

	    	//create path
	    	var route = this.get('route');
	    	var coords = [];
	    	for (i=0;i<route.length;i++) {
				if (route[i] && route[i].longitude && route[i].latitude)
					coords.push([ route[i].longitude, route[i].latitude ]);
			}

			if (coords.length == 0)
				return false;

			var path = {
				geoType: "LineString",
				geoCoordinates: coords,
				properties: {
			    	"record_id": this.get('id'),
			    	"type" : "path"
			  	},
			  	className: 'path record'+this.get('id')+' selected'
			}

			this.geoModel = new GeoModel(path);
			return this.geoModel;
				
	    },

	    getTaskById : function(id) {
	    	return this.get('taskCollection').get(id);
	    },

	    setFocused: function(focused) {
	    	this.set({focused : focused});
	    }

	});
	return RecordModel;
});