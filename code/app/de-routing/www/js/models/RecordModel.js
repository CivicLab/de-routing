define([
        'underscore',
        'backbone',
        'localstorage',
        'models/TaskCollection',
        'models/TaskModel'
], function(_, Backbone,localstorage,TaskCollection,TaskModel){

	var RecordModel = Backbone.Model.extend({
		
		localStorage: new Backbone.LocalStorage("records"),
		
		defaults: {
			completed: false,
			submitted: false,
			step: 0,
			tasks: new TaskCollection(),
			directions: [],
			route: []
		},
		
		// function makes sure that TaskCollection is intialized as a collection
		set: function(attributes, options) {
		    if (attributes.tasks !== undefined && !(attributes.tasks instanceof TaskCollection)) {
		        attributes.tasks = new TaskCollection(attributes.tasks);
		    }
		    return Backbone.Model.prototype.set.call(this, attributes, options);
		},
		
		// creates a new record from exploration data
		createFromData : function(data) {
			
			//create Tasks
			var tasks = new TaskCollection();
			_.each(data.tasks,function(task) {
				tasks.add(new TaskModel(task));
			});
			
			this.set({
				explorer : data.explorer,
				exploration_id : data.id,
				exploration_name : data.explorationName,
				tasks : tasks,
				directions : data.directions
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
		}
	});

	return RecordModel;

});