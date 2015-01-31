define([
  'jquery',
  'underscore',
  'backbone',
  'models/GeoModel'
], function($, _, Backbone, GeoModel){
	
	GeoCollection = Backbone.Collection.extend({
	    
	    model: GeoModel
	 
	});
	
	return GeoCollection;
	
});
