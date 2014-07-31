app.RecordView = Backbone.View.extend({
 
    template:_.template($('#record-view-tpl').html()),
 
    render:function (eventName) {
    	//var subViewHtml = 

        $(this.el).html(this.template( this.model.toJSON() ));

        this.renderSubviews();
        return this;
    },

    renderSubviews: function() {
    	var self = this;

    	var tasks = this.model.get('taskCollection');
    	tasks.each(function(entry) {
    		var view = new app.TaskView({ model : entry });
    		view.render();
    		$(self.el).append(view.el);
    	});
    }
});