define([
        'jquery',
        'underscore',
        'views/BaseView',
        'text!templates/summaryViewTemplate.html'
], function($, _, BaseView, summaryViewTemplate) {
	
	SummaryView = BaseView.extend({

		render:function (eventName) {

			var compiledTemplate = _.template( summaryViewTemplate, { model : this.model.toJSON() });
			this.$el.html( compiledTemplate );

			return this;
		}
	});
	return SummaryView;
});