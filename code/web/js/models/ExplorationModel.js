app.ExplorationModel = Backbone.Model.extend({    
    
    urlRoot : CONSTANTS.SETTING_WEB_SERVICE_URL+'/explorations/',

    defaults : {
    	description : ""
    },

    getMap : function() {
    	if (this.has('json'))
    		return this.get('json').area;
    	else
    		return {};
    },

    getTasks :  function() {
    	if (this.has('json'))
    		return this.get('json').tasklist;
    	else
    		return {};
    }

});