app.ExplorationView = Backbone.View.extend({
 
    //template:_.template($('#tpl-hello-backbone').html()),
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});