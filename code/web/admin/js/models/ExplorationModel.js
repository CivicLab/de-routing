define([
  'jquery',
  'underscore',
  'backbone',
  'values/constants'
], function($, _, Backbone, CONSTANTS){
	 
	var ExplorationModel = Backbone.Model.extend({    
	    
	    urlRoot : CONSTANTS.SETTING_WEB_SERVICE_URL+'/explorations/',
	    
	   
	
	});
	
	return ExplorationModel;
	
});