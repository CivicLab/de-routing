define([
        'underscore',
        'backbone',
        'localstorage',
        'models/ExplorationModel',
        'models/SettingsModel',
        'helpers/ExplorationDownloader'
], function(_, Backbone, localStorage, ExplorationModel, SettingsModel, ExplorationDownloader){
	
	ExplorationCollection = Backbone.Collection.extend({
		model: ExplorationModel,
		
		localStorage: new Backbone.LocalStorage("explorations"),
		
		fetched : false,
		
		syncData: function() {
			if (!this.fetched)
				this.fetch();
			this.fetched = true;
		},
		
		// download data from web db
		download: function(id,successCallback,errorCallback,progressCallback) {
			var self = this;
			
			var explorationDownloader = new ExplorationDownloader(id);
			explorationDownloader.downloadExploration(onSuccess, errorCallback, progressCallback);
			
			function onSuccess(response) {

				exploration = new ExplorationModel();
				exploration.set({
					id: response.id,
					name: response.name,
					json: response.json,
					loaded : true,
					service_url : SettingsModel.get('web_service_url')
				});
				
				self.addExploration(exploration);
				
				successCallback();
			};
		},
		
		addExploration : function(exploration) {
			
			this.push(exploration,{merge: true});
			this.trigger('add');
			//exploration.save();
			
			// delete first model if more than 3 are in the collection
			if (this.length > 3) {
				var model = this.shift();
				model.destroy();
				this.trigger('remove');
			}
			
			this.save(); // save to localStorage
			
		},
		
		save : function() {
			this.each(function(exploration) {
				exploration.save();
			});
		},
		
		removeAll: function() {
			var self = this;
			
			this.each(function(exploration) {
				self.remove(exploration);
				exploration.destroy();
			});
		}
	});
	
	return ExplorationCollection;
});