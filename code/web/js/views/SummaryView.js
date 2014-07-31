app.SummaryView = Backbone.View.extend({
 
    template:_.template($('#summary-view-tpl').html()),
 
    render:function (eventName) {

        $(this.el).html(this.template( this.model.toJSON() ));

        return this;
    }
});