define([
        'underscore',
        'backbone',
        'models/RecordModel',
        'models/TaskModel'
], function(_, Backbone,RecordModel,TaskModel){

	var WalkModel = Backbone.Model.extend({
		
		currentTask : false,
		currentSubstep : 0,
		currentStep : 0,
		record : new RecordModel(),
		currentPosition: false,
		
		initialize: function(options) {
			this._setCurrentTask();
			this.record = options.record;
			
			this.currentStep = this.record.get('step');
			this._setCurrentTask();
		},
		
		getRandomDirection: function() {
			var directions = this.record.get('directions');
			return directions[Math.floor(Math.random()*directions.length)];
		},
		
		getTask: function() {
			return this.currentTask;
			
		},
		
		next: function() {
			if (this.currentSubstep < this.currentTask.length)
				this.currentSubstep++;
			else {
				this._nextTask();
				this.currentSubstep = 0;
			}
			
			this._setCurrentTask();
			
			this.record.set({step : this.currentStep});
			this.record.update();
		},
		
		back: function() {
			if (this.currentSubstep > 0)
				this.currentSubstep--;
			else {
				this._previousTask();
				this._setCurrentTask();
				this.currentSubstep = this.currentTask.length;
			}
			
			this._setCurrentTask();
			
			this.record.set({step : this.currentStep});
			this.record.update();
		},
		
		setGpsPosition: function(pos) {
			this.record.addRoutePosition(pos);
			this.currentPosition = pos;
		},
		
		getProgress: function() {
	    	if (this.currentStep < 1)
	    		return 0;
	    	var taskProgress = 0;
	    	if (this.currentTask.length > 0)
	    		taskProgress = this.currentTask.step / this.currentTask.length;
	    	return (this.currentStep - 1 + taskProgress) / this.record.size();
	    },
	    
	    hasReachedEnd: function() {
	    	if (this.currentTask.type == 'end')
	    		return true;
	    	else
	    		return false;
	    },
	    
	    setCompleted: function() {
	    	this.record.set({completed : true});
	    	this.record.update();
	    },
		
		_nextTask: function() {
			this.currentStep = Math.min(this.currentStep+1,this.record.get('tasks').length+1);
			
		},
		
		_previousTask: function() {
			this.currentStep = Math.max(this.currentStep-1,0);
		},
		
		_setCurrentTask: function() {
			var step = this.currentStep;
			if (step <= 0) //return briefing
				this.currentTask = {
					type: 'briefing', 
					title: this.record.get('title'), 
					text: this.record.get('briefing'), 
					length: 0,
					step: 0
				};
			else if (step <= this.record.get('tasks').length) { //return task
				var task = this.record.get('tasks').at(step-1);
				this.currentTask = {
					type: 'task', 
					model: task, 
					length: task.get('length'),
					step: this.currentSubstep
				};
			} else //return end
				this.currentTask = {
					type: 'end', 
					length: 0,
					step: 0
				};
		}
	});

	return WalkModel;

});