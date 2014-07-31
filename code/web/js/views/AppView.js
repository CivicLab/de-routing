app.AppView = Backbone.View.extend({

	el: '#container',
	template:_.template($('#app-tpl').html()),

	events : {
		'click a.toggleMap': '_onToggleMap',
        'click a.resetMap': '_onResetMap',
        'click a.closeInfo': '_onCloseInfo',
        'click a.minimizeInfo': '_onMinimizeInfo',
        'click a.showSummary': '_onShowSummaryView',
        'click a.hideSidebar': '_onHideSidebar',
	},

    initialize: function(){
        var self = this;
    	//console.log(this);

        //view vars
        this.sidebar_visibility = true;
        this.info_maximized = true;

    	//create record collection
		this.recordCollection = new app.RecordCollection();

		//create task collection
		this.taskCollection = new app.TaskCollection();

        //create geoJson collection
        this.geoCollection = new app.GeoCollection();

        //init the map view
        this.mapModel = new app.MapModel(this.model.getMap());
        this.mapView = new app.MapView({ model : this.mapModel , collection : this.geoCollection, recordCollection : this.recordCollection });

        //add objects
        this.loadModels();

        //add events
        this.recordCollection.on('add', this.addRecord, this);
        this.taskCollection.on('add', this.addTask, this);
        this.taskCollection.on('change:selected', this._onSelectTask, this);
        this.taskCollection.on('change:focused', this.mapView.focusTask, this);

    },
   
    render:function (eventName) {
        var self = this;

        //render main view
        $(this.el).html(this.template());

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
            var task = new app.TaskModel(taskdata[i]);
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
    	var view = new app.RecordButtonView({ model : record });
        view.on('showDetails', this._onShowRecordDetails, this);
		this.$("#recordList").append(view.render().el);

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
        })

    },

    addTask: function(task) {
        var view = new app.TaskButtonView({ model : task });
        this.$("#taskList").append(view.render().el);
    
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
        var view = new app.RecordView({model : record});
        this.$("#infoContent").html(view.render().el)
        this.$("#info").removeClass("hidden");

        return false;
    },

    _onShowSummaryView: function() {
        var view = new app.SummaryView({model : this.model});
        this.$("#infoContent").html(view.render().el)
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
            this.$("#sidebar").animate({ height: 70});
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