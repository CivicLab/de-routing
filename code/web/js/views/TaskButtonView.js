define([
        'jquery',
        'underscore',
        'views/BaseView',
        'text!templates/taskButtonViewTemplate.html'
], function($, _, BaseView, taskButtonViewTemplate) {


	TaskButtonView = BaseView.extend({

		tagName: 'li',
		className: 'selected',

		events: {
	      'click a.select': 'toggleSelect',
	      'mouseover':'startHover',
	      'mouseleave':'stopHover'
	    },

	   
	    render:function (eventName) {
	    	var compiledTemplate = _.template( taskButtonViewTemplate, { model: this.model.toJSON() });
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
	});

	return TaskButtonView;
});