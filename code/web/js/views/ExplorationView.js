define([
	'jquery',
	'underscore',
	'views/BaseView',
	'models/ExplorationModel',
	'models/RecordCollection',
	'models/TaskCollection',
	'models/GeoCollection',
	'models/MapModel',
	'views/MapView',
	'views/RecordButtonView',
	'views/TaskButtonView',
	'views/RecordView',
	'views/SummaryView',
	'text!templates/explorationViewTemplate.html'
], function($, _, BaseView, ExplorationModel, RecordCollection, TaskCollection, GeoCollection, MapModel, MapView, RecordButtonView, TaskButtonView, RecordView, SummaryView, explorationViewTemplate){

	var ExplorationView = BaseView.extend({
		
		events : {
			'click a.toggleMap': '_onToggleMap',
	        'click a.resetMap': '_onResetMap',
	        'click a.closeInfo': '_onCloseInfo',
	        'click a.minimizeInfo': '_onMinimizeInfo',
	        'click a.showSummary': '_onShowSummaryView',
	        'click a.hideSidebar': '_onHideSidebar',
		},

	    initialize: function(options){
	    	var self = this;

	        //view vars
	        this.sidebar_visibility = true;
	        this.info_maximized = true;

	    	//create record collection
			this.recordCollection = new RecordCollection();

			//create task collection
			this.taskCollection = new TaskCollection();

	        //create geoJson collection
	        this.geoCollection = new GeoCollection();

	        //add events
	        this.recordCollection.on('add', this.addRecord, this);
	        this.taskCollection.on('add', this.addTask, this);
	        this.taskCollection.on('change:selected', this._onSelectTask, this);
	       
	        // load exploration
	    	this.model = new ExplorationModel({id: options.id});
	        this.model.fetch({
	            success: function(model,response,options) {
	                if (response.length == 0)
	                    alert("No data for specified id");
	                else {
	                	self.loadModels();
	                	self.render();
	                }
	                
	            },
	            error: function(model,response,options) {
	                alert("Cannot connect to server.");
	            }
	        });

	        BaseView.prototype.initialize.call(this);
	    },
	   
	    render: function () {
	    	
	        var compiledTemplate = _.template( explorationViewTemplate, {});
			this.$el.html( compiledTemplate );
			
			if (this.model == null)
				return this;
			
			// init map
			this.mapModel = new MapModel(this.model.getMap());
	        this.mapView = new MapView({ model : this.mapModel , collection : this.geoCollection, recordCollection : this.recordCollection });
	        this.taskCollection.on('change:focused', this.mapView.focusTask, this);
	        this.addChildView(this.mapView);
			
	        //render map
	        this.mapView.setElement(this.$('#map'));
	        this.mapView.render();

	        this.addAll();

	        return this;
	    },

	    loadModels: function() {

	        //load and display tasks
	        taskdata = this.model.getTasks();
	        var tasks = [];
	        for (i=0;i<taskdata.length;i++) {
	            var task = new TaskModel(taskdata[i]);
	            tasks.push(task);
	        }
	        this.taskCollection.add(tasks);

	        //load all the records
	        this.recordCollection.fetch({
	            data: $.param({ exploration_id: this.model.id})
	        });
	    },

	    addAll: function() {
	        var self = this;

	        this.taskCollection.each(function(task) {
	            self.addTask(task);
	        });
	        this.recordCollection.each(function(record) {
	            self.addRecord(record);
	        })
	    },

	    addRecord: function(record) {
	        var self = this;

	        //add record to list
	    	var view = new RecordButtonView({ model : record });
	        view.on('showDetails', this._onShowRecordDetails, this);
	        
	        this.append(view, '#recordList');

	        //add record path to map
	        var path = record.getGeoModel();
	        if (path)
	            this.geoCollection.add(path);

	        //add tasks marker to map
	        var tasks = record.get('taskCollection');
	        tasks.each(function(task) {
	            var marker = task.getGeoModel();
	            if (marker)
	                self.geoCollection.add(marker);
	        });

	    },

	    addTask: function(task) {
	        var view = new TaskButtonView({ model : task });
	        this.append(view, '#taskList');
	    },

	    //sets all connected tasks to selected
	    _onSelectTask: function(task) {
	        this.recordCollection.each(function(record) {
	            var t = record.getTaskById(task.get('id'));
	            if (t)
	                t.set({selected : task.get('selected')});
	        });
	    },

	    _onShowRecordDetails: function(record) {
	        var view = new RecordView({model : record});
	        this.assign(view,'#infoContent');
	        this.$("#info").removeClass("hidden");

	        return false;
	    },

	    _onShowSummaryView: function() {
	        var view = new SummaryView({model : this.model});
	        this.assign(view,'#infoContent');
	        this.$("#info").removeClass("hidden");

	        return false;
	    },

	    _onCloseInfo: function() {
	        this.$("#infoContent").empty();
	        this.$("#info").addClass("hidden");
	        
	        return false;
	    },

	    _onMinimizeInfo: function() {
	        var self = this;

	        if (this.info_maximized) {
	            this.$("#info").animate({ height: '40%'});
	        } else {
	            this.$("#info").animate({ height: '90%'},function() {
	                self.$("#info").height('auto');
	            });
	        }

	        this.info_maximized = !this.info_maximized;

	        return false
	    },

	    _onToggleMap: function() {
	    	this.mapModel.set({ visibility : !this.mapModel.get('visibility') });
	    	
	    	return false;
	    },

	    _onResetMap: function() {
	        if (this.mapView) {
	            this.mapView.resetView();
	        }
	    },

	    _onHideSidebar: function() {
	        var self = this;

	        if (this.sidebar_visibility) {
	            this.$("#sidebar").animate({ height: 100});
	            this.$("#sidebar").addClass('minimized');
	        } else {
	            this.$("#sidebar").animate({ height: '90%'},function() {
	                self.$("#sidebar").height('auto');
	            });
	            this.$("#sidebar").removeClass('minimized');
	        }

	        this.sidebar_visibility = !this.sidebar_visibility;
	    }

	});
	
	return ExplorationView;
	
});

