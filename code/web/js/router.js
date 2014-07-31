app.Router = Backbone.Router.extend({

    routes:{
        "exploration/:id": "showExploration",
        "explorations" : "listExploration",
        "": "listExplorations"
    },

    showExploration: function(id,id2) {

        var explorationModel = new app.ExplorationModel({'id' : id});
        explorationModel.fetch({
            success: function(model,response,options) {
                if (response.length == 0)
                    alert("No data for specified id");
                else {
                    var appView = new app.AppView({model:explorationModel});
                    appView.render();
                }
                
            },
            error: function(model,response,options) {
                alert("Cannot connect to server.");
            }
        });

        /*var explorationModel = new app.ExplorationModel({'id' : id});
        var explorationView = new app.ExplorationView({model:explorationModel});
         explorationModel.fetch({
            success: function() {
                $('#container').html(explorationView.render().el);
            }
        });*/      
    	  
    },

    listExplorations: function() {
        var explorationCollection = new app.ExplorationCollection();
        explorationCollection.fetch({
           success: function (model, response, options) {
               //console.log(JSON.stringify(response));
           }
        });
    }
    /*displayExplorations: function() {
 
        var explorationCollection = new ExplorationCollection();
        //console.log(JSON.stringify(explorationCollection));

        //var messageListView = new MessageListView({model:messageCollection});
        explorationCollection.fetch({
           success: function (model, response, options) {
               console.log(JSON.stringify(response));
           },
           data: $.param({ name: '"Mehringplatz"'})
        });
    }*/
});
 
var router = new app.Router();
