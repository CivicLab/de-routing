define([
        'underscore',
        'backbone',
        'localstorage'
], function(_, Backbone,localstorage){

	var ExplorationModel = Backbone.Model.extend({
		
		localStorage: new Backbone.LocalStorage("explorations"),
		
		defaults: {
			id: -1,
			loaded : false,
			service_url : "",
			randomTasks: false
		},
		
		getExplorationData: function(explorerName) {
			var data = {
				id : this.get('id'),
				explorationName : this.get('name'),
				explorer : explorerName,
				randomTasks : this.get('json').randomTasks,
				tasks : this.get('json').tasklist,
				directions : this.get('json').directions,
				area : this.get('json').area,
				briefing: this.get('json').briefing,
				title: this.get('json').name
				
			};
			return data;
		}
		
	});

	// Return the model for the module
	return ExplorationModel;

});