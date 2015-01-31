define([
        'jquery',
        'underscore',
        'views/BaseView',
        'text!templates/recordButtonViewTemplate.html'
], function($, _, BaseView, recordButtonViewTemplate) {


	RecordButtonView = BaseView.extend({

		tagName : 'li',
		className: 'selected',

		events: {
			'click a.select': 'toggleSelect',
			'click a.details': 'showDetails',
			'mouseover':'startHover',
			'mouseleave':'stopHover'
		},

		render: function (eventName) {
			
			var compiledTemplate = _.template( recordButtonViewTemplate, { model: this.model.toJSON() });
			this.$el.html( compiledTemplate );
			return this;
		},

		toggleSelect: function() {
			this.model.set({selected : !this.model.get('selected') })

			if (this.model.get('selected')) {
				$(this.el).addClass('selected');
			} else {
				$(this.el).removeClass('selected');
			}

			return false;
		},

		startHover: function() {
			this.model.setFocused(true);
		},

		stopHover: function() {
			this.model.setFocused(false);
		},

		showDetails: function() {
			this.trigger('showDetails',this.model);  
		}
	});

	return RecordButtonView;
});