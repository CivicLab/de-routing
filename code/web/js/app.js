define([
	'jquery',
	'underscore',
	'backbone',
	'views/admin/ExplorationListView',
	'views/admin/ExplorationEditView',
	'views/admin/RecordListView',
	'views/ExplorationView'
], function($, _, Backbone, ExplorationListView, ExplorationEditView, RecordListView, ExplorationView){

	var AppRouter = Backbone.Router.extend({
		routes: {
			"exploration/:id": "showExploration",
			'admin/exploration/:id' : 'editExploration',
			'admin/records/:exploration_id' : 'listRecords',
			'admin' : 'listExplorations',
			'admin/' : 'listExplorations',
			'' : 'listExplorations'
		},
	});
	
	// adds all views to #container and removes unused views
	var AppView = {
			showView: function(view) {
				if (this.currentView){
					this.currentView.close();
				}
				this.currentView = view;
				this.currentView.render();
				$("#container").append(this.currentView.el);
			}
	};

	var initialize = function(){
		
		//setup routes
		var app_router = new AppRouter;
		app_router.on('route:showExploration', function(id){
			AppView.showView(new ExplorationView({id: id}));
	    });  
		app_router.on('route:listExplorations', function(){
			AppView.showView(new ExplorationListView());
		});
		
		app_router.on('route:editExploration', function(id){
			AppView.showView(new ExplorationEditView({ id: id }));
		});
		
		app_router.on('route:listRecords', function(id){
			AppView.showView(new RecordListView({ id: id }));
		});
		
		//Backbone.emulateHTTP = true; // turn of delete and put request 
		
		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});