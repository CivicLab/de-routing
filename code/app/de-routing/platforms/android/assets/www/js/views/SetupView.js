define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/ExplorationCollection',
	'views/ExplorationListView',
	'views/DownloadOverlay',
	'views/ProgressOverlay',
	'text!templates/setupTemplate.html'
], function($, _, BaseView, ExplorationCollection, ExplorationListView, DownloadOverlay, ProgressOverlay, explorationTemplate){
	
	var ExplorationView = BaseView.extend({
		
		events : {
			'click a.downloadExploration': '_onShowDownloadOverlay'
		},
		
		initialize: function() {
			//BaseView.prototype.initialize.call(this);
			
			//load data from local storage
			this.collection.syncData();
			
			// add subviews
			this.explorationListView = new ExplorationListView({collection: this.collection});
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( explorationTemplate, {} );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			this.assign(this.explorationListView,"#explorationList");
			
			return this;
		},
		
		_onShowDownloadOverlay: function() {
			var self = this;
			
			var downloadOverlay = new DownloadOverlay({callback: function(result) {
				if (result) {
					this.close(); //close downloadOverlay
					
					//create progressoverlay
					var progressOverlay = new ProgressOverlay({text: "Downloading..."});
					progressOverlay.show();
					self.collection.download(result,onSuccess,onError,onProgress);
					function onSuccess() {
						progressOverlay.setFinished("Exploration downloaded.",1000);
					};
					function onError(error) {
						progressOverlay.setFinished(error,1500);
					};
					function onProgress(progress) {
						progressOverlay.setProgress(progress);
					};
				}
			}});
			this.addChildView(downloadOverlay);
			downloadOverlay.show();
			return false;
		}
	});
	// Our module now returns our view
	return ExplorationView;
	
});