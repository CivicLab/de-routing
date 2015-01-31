define([
        'jquery',
        'underscore',
        'views/BaseView',
        'views/TaskView',
        'text!templates/recordViewTemplate.html'
], function($, _, BaseView, TaskView, recordViewTemplate) {

	RecordView = BaseView.extend({

		render:function (eventName) {

			var compiledTemplate = _.template( recordViewTemplate, { model: this.model.toJSON() });
			this.$el.html( compiledTemplate );

			this.renderSubviews();
			return this;
		},

		renderSubviews: function() {
			var self = this;

			var tasks = this.model.get('taskCollection');
			tasks.each(function(entry) {
				var view = new TaskView({ model : entry });
				view.render();
				$(self.el).append(view.el);
			});
		}
	});

	return RecordView;

});