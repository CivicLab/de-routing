define([
  'jquery',
  'underscore',
  'backbone',
  'values/constants',
  'models/ExplorationModel'
], function($, _, Backbone, CONSTANTS, ExplorationModel){
	
	var ExplorationCollection = Backbone.Collection.extend({
	 	
	    url: CONSTANTS.SETTING_WEB_SERVICE_URL+"/explorations/",
	    model: ExplorationModel
	 
	});
	
	return ExplorationCollection;
});

