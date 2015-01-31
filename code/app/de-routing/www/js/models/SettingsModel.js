define([
        'underscore',
        'backbone',
        'localstorage'
], function(_, Backbone,localstorage){

	/* uses singleton pattern */
	
	var SettingsModel = Backbone.Model.extend({
		
		localStorage: new Backbone.LocalStorage("settings"),
		
		defaults: {
			web_service_url: "http://derouting.community-infrastructuring.org/demo/api",
			id: 1
		},
		
		update: function() {
			this.localStorage.update(this);
		},
		
	});

	// Return the instance for the model
	return new SettingsModel;

});