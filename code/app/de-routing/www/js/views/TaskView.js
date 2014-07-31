define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/TaskModel',
	'values/language',
	'helpers/Utils',
	'text!templates/taskBriefingTemplate.html',
	'text!templates/taskDirectionTemplate.html',
	'text!templates/taskPictureTemplate.html',
	'text!templates/taskVideoTemplate.html',
	'text!templates/taskAudioTemplate.html',
	'text!templates/taskNoneTemplate.html',
	'text!templates/taskSliderTemplate.html',
	'text!templates/taskTextTemplate.html'
], function($, _, BaseView, TaskModel, LANGUAGE, Utils, taskBriefingTemplate, taskDirectionTemplate, 
		taskPictureTemplate, taskVideoTemplate, taskAudioTemplate, taskNoneTemplate, 
		taskSliderTemplate, taskTextTemplate){
	
	var TaskView = BaseView.extend({
		
		events: {
			'click .button.taskAction': '_onTaskActionButtonClick'
		},
		
		render: function(){
			//console.log(this.subtask);
			
			//choose the template
			var compiledTemplate;
			if (this.subtask.type=='briefing')
				compiledTemplate = _.template( taskBriefingTemplate, this.subtask );
			else if (this.subtask.type=='end')
				compiledTemplate = _.template( taskBriefingTemplate, { title: LANGUAGE.TASK_COMPLETED_TITLE,
					text: LANGUAGE.TASK_COMPLETED_TEXT} );
			else if (this.subtask.type=='direction')
				compiledTemplate = _.template( taskDirectionTemplate, this.subtask );
			else if (this.subtask.type=='subtask' && this.subtask.subtask.action=='picture')
				compiledTemplate = _.template( taskPictureTemplate, this.subtask );
			else if (this.subtask.type=='subtask' && this.subtask.subtask.action=='video')
				compiledTemplate = _.template( taskVideoTemplate, this.subtask );
			else if (this.subtask.type=='subtask' && this.subtask.subtask.action=='audio')
				compiledTemplate = _.template( taskAudioTemplate, this.subtask );
			else if (this.subtask.type=='subtask' && this.subtask.subtask.action=='none')
				compiledTemplate = _.template( taskNoneTemplate, this.subtask );
			else if (this.subtask.type=='subtask' && this.subtask.subtask.action=='slider')
				compiledTemplate = _.template( taskSliderTemplate, this.subtask );
			else if (this.subtask.type=='subtask' && this.subtask.subtask.action=='text')
				compiledTemplate = _.template( taskTextTemplate, this.subtask );
			else
				compiledTemplate = "<h2>Error - No such template</h2>";
			
			this.$el.html( compiledTemplate );
			return this;
		},
		
		prepareTask: function() {
			this.task = this.model.getTask();
			
			if (this.task.type=='task') {
				if (this.task.step == 0) {
					if (this.task.model.getDirection() == false) // create new direction
						this.task.model.setDirection(this.model.getRandomDirection());
					this.subtask = {type:'direction' , direction: this.task.model.getDirection()};
				} else
					this.subtask = {type:'subtask' , subtask: this.task.model.getSubtask(this.task.step - 1) };//this.task.model.subtasks[this.task.step-1]}; // double task is ugly
			} else
				this.subtask = this.task;
		},
		
		setTaskResult: function() {
			if (this.subtask.type == 'subtask' && this.subtask.action != "none") {
				var result = $('.result').val();
				this.task.model.setSubtaskResult(this.task.step - 1,result,this.model.currentPosition);
			}
			//console.log(this.task);
		},
		
		// starts the task action
		_onTaskActionButtonClick: function() {
			console.log("action for: "+this.subtask.subtask.action);
			
			// take picture
			if (this.subtask.subtask.action == 'picture') {
		 
		    	var onSuccess = function(imagePath) {
		    		console.log("pic:"+imagePath[0].fullPath);
		    		$('.result-image').attr('src',imagePath[0].fullPath);
		    		$('.result-image').show();
		    		$('.result').val(imagePath[0].fullPath);
		    	};

		    	var onFail = function() {
		    		console.log("fail pic");
		    	};
		    	
		    	navigator.device.capture.captureImage(onSuccess, onFail);
		    	
			} else if (this.subtask.subtask.action == 'video') {
		 
		    	var onSuccess = function(videoPath) {
		    		console.log("vid:"+videoPath[0].fullPath);
		    		$('.result-text').text("Video saved");
		    		$('.result-text').show();
		    		$('.result').val(videoPath[0].fullPath);
		    	};

		    	var onFail = function () {
		    		console.log("fail vid");
		    	};
		    	
		    	var options = {limit:1,duration:10};
		    	if ('length' in this.subtask.subtask)
		    		options.duration = this.subtask.subtask.length;
		    	
		    	navigator.device.capture.captureVideo(onSuccess, onFail, options);
		    	
			} else if (this.subtask.subtask.action == 'audio') {
				
				if ('length' in this.subtask.subtask)
		    		duration = this.subtask.subtask.length;
				var duration = 10;
				
		    	navigator.soundRecorder.open(function(filePath) {
		    		console.log("audio file: "+filePath);
		    		$('.result-text').text("Audio recording saved");
		    		$('.result-text').show();
		    		$('.result').val(filePath);
		    		
		    	}, function() {},duration * 1000);
		    	
			}
			return false;
		}
		
	});
	// Our module now returns our view
	return TaskView;
});