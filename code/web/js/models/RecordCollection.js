define([
  'jquery',
  'underscore',
  'backbone',
  'values/constants',
  'models/RecordModel'
], function($, _, Backbone, CONSTANTS, RecordModel){
	
	RecordCollection = Backbone.Collection.extend({
		 
	    url: CONSTANTS.SETTING_WEB_SERVICE_URL+"/records/",
	    model: RecordModel

	});
	return RecordCollection;
	
});
