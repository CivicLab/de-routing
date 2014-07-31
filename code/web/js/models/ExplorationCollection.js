app.ExplorationCollection = Backbone.Collection.extend({
 	
    url: CONSTANTS.SETTING_WEB_SERVICE_URL+"/explorations/",
    model: app.ExplorationModel
 
});