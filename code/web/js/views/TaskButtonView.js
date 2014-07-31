app.TaskButtonView = Backbone.View.extend({

	template:_.template($('#task-button-tpl').html()),
	tagName: 'li',
	className: 'selected',

	events: {
      'click a.select': 'toggleSelect',
      'mouseover':'startHover',
      'mouseleave':'stopHover'
    },

    initialize: function(){
    },
   
    render:function (eventName) {
        
        $(this.el).html(this.template(this.model.toJSON()));
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