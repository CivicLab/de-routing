app.RecordButtonView = Backbone.View.extend({

	template:_.template($('#record-button-tpl').html()),
	tagName : 'li',
	className: 'selected',

    initialize: function(){
    	
    },

    events: {
      'click a.select': 'toggleSelect',
      'click a.details': 'showDetails',
      'mouseover':'startHover',
      'mouseleave':'stopHover'
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

    showDetails: function() {
        this.trigger('showDetails',this.model);  
    }
});