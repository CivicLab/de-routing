app.RecordCollection = Backbone.Collection.extend({
 
    url: CONSTANTS.SETTING_WEB_SERVICE_URL+"/records/",
    model: app.RecordModel

});