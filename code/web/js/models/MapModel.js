define([
        'jquery',
        'underscore',
        'backbone'
], function($, _, Backbone){

	MapModel = Backbone.Model.extend({

	    defaults : {
	    	visibility : true,
	    	longitude : 13.322649,
	    	latitude : 52.517106,
	    	zoom: 16
	    },

	    initialize : function () {
	    	//calculate map boundaries

	    }
	});
	
	return MapModel;
});