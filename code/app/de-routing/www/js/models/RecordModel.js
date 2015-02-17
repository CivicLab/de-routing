define([
        'underscore',
        'backbone',
        'localstorage',
        'models/TaskCollection',
        'models/TaskModel',
        'helpers/Utils',
        'values/constants',
        'helpers/FileUploader'
], function(_, Backbone,localstorage,TaskCollection,TaskModel,Utils,CONSTANTS,FileUploader){

	var RecordModel = Backbone.Model.extend({
		
		localStorage: new Backbone.LocalStorage("records"),
		
		defaults: {
			completed: false,
			submitted: false,
			step: 0,
			tasks: new TaskCollection(),
			directions: [],
			route: [],
			service_url: "",
			briefing: "",
			title: ""
		},
		
		// function makes sure that TaskCollection is intialized as a collection
		set: function(attributes, options) {
		    if (attributes.tasks !== undefined && !(attributes.tasks instanceof TaskCollection)) {
		        attributes.tasks = new TaskCollection(attributes.tasks);
		    }
		    return Backbone.Model.prototype.set.call(this, attributes, options);
		},
		
		// creates a new record from exploration data
		createFromData : function(data,service_url) {
			
			//create Tasks
			var tasks = new TaskCollection();
			
			// shuffle tasks
			if (data.randomTasks)
				data.tasks = Utils.shuffle(data.tasks);
			
			_.each(data.tasks,function(task) {
				tasks.add(new TaskModel(task));
			});	
			
			this.set({
				explorer : data.explorer,
				exploration_id : data.id,
				exploration_name : data.explorationName,
				tasks : tasks,
				directions : data.directions,
				service_url : service_url,
				briefing : data.briefing,
				title : data.title
			});
		},
		
		addRoutePosition: function(pos) {
			this.get('route').push(pos);
		},
		
		update: function() {
			this.localStorage.update(this);
		},
		
		size: function() {
			return this.get('tasks').length;
		},
		
		upload: function(options) {
			
			var self = this;
			
			// then upload files
			function uploadFiles(files) {
				FileUploader.uploadFiles(files,
					self.get('service_url')+"/records/upload/"+self.get('id'),
					{
						success: function() {
							options.success();
						},
						error: function(error) {
							options.error(error);
						},
						progress: function(progress) {
							options.progress(progress);
						}
					}
				);
			}

			console.log('sending record data...');
			// first send data
			request = $.ajax({
				url:  self.get('service_url')+"/records/submit",
				type: "post",
				dataType: "json",
				data: {"record" : self.createJSON() },
				timeout: CONSTANTS.SETTING_WEB_TIMEOUT,
				success: function(response) {
					console.log("data sent");
					//console.log(response);
					uploadFiles(response.files);
				},
			    error: function(error) {
			    	options.error("Could not connect to server.");
			    	console.log(error);
			    }
			});
		},
		
		createJSON: function() {
			
			var json = this.toJSON();
			
			json['tasks'] = this.get('tasks').toJSON();
			
			return json;
			
		},
	});

	return RecordModel;

});