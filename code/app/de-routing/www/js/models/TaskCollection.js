define([
        'underscore',
        'backbone',
        'models/TaskModel'
], function(_, Backbone,TaskModel){
	
	TaskCollection = Backbone.Collection.extend({
		model: TaskModel
	});
	
	return TaskCollection;
});