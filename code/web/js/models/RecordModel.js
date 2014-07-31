app.RecordModel = Backbone.Model.extend({    
    
    urlRoot : CONSTANTS.SETTING_WEB_SERVICE_URL+'/records/',
    
    defaults : {
    	focused : false,
    	selected : true,
    	tasks : [],
    	route : [],

    	taskCollection : false, //holds the task collection

    },

    initialize: function() {
    	var self = this;

    	if (this.get('tasks') == null)
    		this.set({ tasks : [] });

    	this._createTaskCollection();
    	this.geoModel = null;

		this.on('change:selected', function() {
			if (this.geoModel)
				this.geoModel.setVisibility(this.get('selected'));
			this.get('taskCollection').each(function(task) {
				task.onSelectedChange();
			})
		})
    },

    _createTaskCollection: function() {
    	taskdata = this.get('tasks');
		var tasks = [];
		for (i=0;i<taskdata.length;i++) {
			taskdata[i].record_id = this.get('id');
			taskdata[i].record = this;
			var task = new app.TaskModel(taskdata[i]);
			tasks.push(task);
		}
		this.set({taskCollection : new app.TaskCollection(tasks)});
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

		this.geoModel = new app.GeoModel(path);
		return this.geoModel
			
    },

    getTaskById : function(id) {
    	return this.get('taskCollection').get(id);
    },

    setFocused: function(focused) {
    	this.set({focused : focused});
    }
});