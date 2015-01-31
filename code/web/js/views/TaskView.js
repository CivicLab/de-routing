define([
        'jquery',
        'underscore',
        'views/BaseView',
        'views/LightBoxView',
        'text!templates/taskViewTemplate.html',
        'text!templates/tasks/taskTextTemplate.html',
        'text!templates/tasks/taskPictureTemplate.html',
        'text!templates/tasks/taskNoneTemplate.html',
        'text!templates/tasks/taskAudioTemplate.html',
        'text!templates/tasks/taskVideoTemplate.html',
        'text!templates/tasks/taskSliderTemplate.html'
], function($, _, BaseView, LightBoxView, taskViewTemplate, taskTextTemplate, taskPictureTemplate, taskNoneTemplate, taskAudioTemplate, taskVideoTemplate, taskSliderTemplate) {

	TaskView = Backbone.View.extend({

		template:_.template(taskViewTemplate),

		className: 'task',

		events: {
			'click a.openLightbox' : 'openLightbox'
		},

		initialize: function(){
			//task templates
			/*this.textTemplate = _.template($('#task-text-tpl').html());
			this.pictureTemplate = _.template($('#task-picture-tpl').html());
			this.audioTemplate = _.template($('#task-audio-tpl').html());
			this.videoTemplate = _.template($('#task-video-tpl').html());
			this.sliderTemplate = _.template($('#task-slider-tpl').html());
			this.noneTemplate = _.template($('#task-none-tpl').html());*/


		},

		render:function (explorerName) {

			// render everything
			var compiledTemplate = _.template( taskViewTemplate, {  model: _.extend(this.model.toJSON(), { name : explorerName }) });
			this.$el.html( compiledTemplate );
			//render subview
			this.$('.subtasks').append(this.renderSubviews());

			return this;
		},

		renderSubviews: function() {
			var self = this;

			var html = "";
			var subtasks = this.model.get('subtaskCollection');
			//console.log(subtasks);
			subtasks.each(function(entry) {
				switch(entry.get('action')) {
				case 'text':
					html += _.template( taskTextTemplate, {task: entry.toJSON()});
					break;
				case 'none':
					html += _.template( taskNoneTemplate, {task: entry.toJSON()});
					break;
				case 'picture':
					html += _.template( taskPictureTemplate, {task: entry.toJSON()});
					break;
				case 'audio':
					html += _.template( taskAudioTemplate, {task: entry.toJSON()});
					break;
				case 'video':
					html += _.template( taskVideoTemplate, {task: entry.toJSON()});
					break;
				case 'slider':
					html += _.template( taskSliderTemplate, {task: entry.toJSON()});
					break;
				default:
					html += "<li>No Template for "+entry.get('action')+"</li>";
				}

			});
			return(html);
		},

		openLightbox: function() {
			var url = arguments[0].currentTarget.href;
			var lightbox = new LightBoxView({ contentUrl : url });
			lightbox.render().show();
			return false;
		}
	});

	return TaskView;
});