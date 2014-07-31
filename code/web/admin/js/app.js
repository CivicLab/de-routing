define([
	'jquery',
	'underscore',
	'backbone',
	'views/ExplorationListView',
	'views/ExplorationEditView'
], function($, _, Backbone, ExplorationListView, ExplorationEditView){

	var AppRouter = Backbone.Router.extend({
		routes: {
			'exploration/:id' : 'editExploration',
			'*actions' : 'listExplorations'
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
		app_router.on('route:listExplorations', function(){
			AppView.showView(new ExplorationListView());
		});
		
		app_router.on('route:editExploration', function(id){
			AppView.showView(new ExplorationEditView({ id: id }));
		});
		

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});