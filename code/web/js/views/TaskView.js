app.TaskView = Backbone.View.extend({

	template:_.template($('#task-view-tpl').html()),

    className: 'task',

    events: {
        'click a.openLightbox' : 'openLightbox'
    },

    initialize: function(){

        //task templates
        this.textTemplate = _.template($('#task-text-tpl').html());
        this.pictureTemplate = _.template($('#task-picture-tpl').html());
        this.audioTemplate = _.template($('#task-audio-tpl').html());
        this.videoTemplate = _.template($('#task-video-tpl').html());
        this.sliderTemplate = _.template($('#task-slider-tpl').html());
        this.noneTemplate = _.template($('#task-none-tpl').html());


    },
   
    render:function (explorerName) {

        // render everything
        $(this.el).html( this.template( _.extend(this.model.toJSON(), { name : explorerName })));
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
                    html += self.textTemplate(entry.toJSON());
                    break;
                case 'none':
                    html += self.noneTemplate(entry.toJSON());
                    break;
                case 'picture':
                    html += self.pictureTemplate(entry.toJSON());
                    break;
                case 'audio':
                    html += self.audioTemplate(entry.toJSON());
                    break;
                case 'video':
                    html += self.videoTemplate(entry.toJSON());
                    break;
                case 'slider':
                    html += self.sliderTemplate(entry.toJSON());
                    break;
                default:
                    html += "<li>No Template for "+entry.get('action')+"</li>";
            }
            
        });
        return(html);
    },

    openLightbox: function() {
        var url = arguments[0].currentTarget.href;
        var lightbox = new app.LightBoxView({ contentUrl : url })
        lightbox.render().show();
        return false;
    }
});