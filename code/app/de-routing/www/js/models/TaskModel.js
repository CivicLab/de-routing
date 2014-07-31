define([
        'underscore',
        'backbone',
], function(_, Backbone){
	
	TaskModel = Backbone.Model.extend({    

		defaults : {
			id: -1,
			title: "",
			text: "",
			subtasks: [],
			direction: false,
			length: 0,
			location: false
		},
		
		initialize: function() {
			this.set({length: this.get('subtasks').length});
		},
		
		setSubtaskResult: function(subtask_id,result,gpsPos) {
			var subtask = this.get('subtasks')[subtask_id];
			subtask.result = result;
			
			// add gpsPos if defined and not already added
			if (!this.get('location') && gpsPos) {
				this.set({location: gpsPos });
			}
			
			//add file result type for some of the actions
			if (!('resultType' in subtask)) {
				if (subtask.action == 'video' || subtask.action == 'audio' || subtask.action == 'picture')
					subtask.resultType = "file";
				else
					subtask.resultType = "value";
			}
			//console.log(this);
		},
		
		getSubtask: function(id) {
			return this.get('subtasks')[id];
		},
		
		getDirection: function() {
			return this.get('direction');
		},
		
		setDirection: function(direction) {
			this.set({direction: direction});
		}

	});
	return TaskModel;
});

