define([
	'jquery',
	'underscore',
	'backbone',
	'views/HomeView',
	'views/SetupView',
	'views/ExplorationView',
	'views/RecordListView',
	'views/RecordView',
	'views/WalkView',
	'views/SettingsView',
	'models/ExplorationCollection',
	'models/RecordCollection',
	'models/SettingsModel'
], function($, _, Backbone,HomeView,SetupView,ExplorationView,RecordListView,RecordView,WalkView,SettingsView,ExplorationCollection,RecordCollection,SettingsModel){

	var AppRouter = Backbone.Router.extend({
		routes: {
			'setup' : 'setupExploration',
			'start/:id' : 'startExploration',
			'records' : 'listRecords',
			'record/:id' : 'showRecord',
			'walk/:id': 'walk',
			'settings' : 'settings',
			'*actions' : 'default'
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

		// create global collections
		var explorationCollection = new ExplorationCollection();
		var recordCollection = new RecordCollection();
		
		//load settings
		SettingsModel.fetch();
		
		//setup routes
		var app_router = new AppRouter;
		app_router.on('route:setupExploration', function(){
			AppView.showView(new SetupView({collection: explorationCollection}));
		});
		app_router.on('route:startExploration', function(id){
			AppView.showView(new ExplorationView({id: id, explorations: explorationCollection, records: recordCollection}));
		});
		app_router.on('route:listRecords', function(){
			AppView.showView(new RecordListView({collection: recordCollection}));
		});
		app_router.on('route:showRecord', function(id){
			AppView.showView(new RecordView({id: id, collection: recordCollection}));
		});
		app_router.on('route:walk', function(id){
			AppView.showView(new WalkView({id: id, collection: recordCollection}));
		});
		app_router.on('route:settings', function(actions){
			AppView.showView(new SettingsView({collection : explorationCollection}));
		});
		app_router.on('route:default', function(actions){
			AppView.showView(new HomeView());
		});

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});