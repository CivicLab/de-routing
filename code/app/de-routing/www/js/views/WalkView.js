define([
	'jquery',
	'underscore',
	'views/BaseView',
	'views/TaskView',
	'views/AlertOverlay',
	'models/WalkModel',
	'helpers/GpsLocation',
	'helpers/Utils',
	'text!templates/walkTemplate.html'
], function($, _, BaseView, TaskView, AlertOverlay, WalkModel, GpsLocation, Utils, walkTemplate){
	
	var WalkView = BaseView.extend({
		
		events : {
			'click a.next': '_onNext',
			'click a.back': '_onBack'
		},

		initialize: function() {
			
			//load data from local storage
			this.collection.syncData();
			var record = this.collection.get({id : this.id});
			this.model = new WalkModel({record : record});
			
			this.taskView = new TaskView({model : this.model});
			
			//Backbutton state
			this.backButtonEnabled = false;
			
			//reroute backbutton event
			var self = this;
	        this._backbuttonHandler = function() {
	        	self._onBack();
	        };
	        document.addEventListener("backbutton",this._backbuttonHandler,false);
			
			BaseView.prototype.initialize.call(this);
			
			//enable gps
			this.gps = new GpsLocation();
			this.gps.start(Utils.bind(this,this._onNewGpsLocation),Utils.bind(this,this._onGpsUpdate));
			
			//check gps state after 45 seconds
			this._checkGpsEnabled();
		},
		
		close: function() {
			this.gps.stop();
			
			//remove back event
			document.removeEventListener("backbutton",this._backbuttonHandler,false)
			
			BaseView.prototype.close.call(this);
		},
		
		render: function(){
			var compiledTemplate = _.template( walkTemplate, {backButtonEnabled: this.backButtonEnabled} );
			
			this.$el.html( compiledTemplate );
			
			this.taskView.prepareTask();
			this.assign(this.taskView,".task");
			
			//adjust the progress bar
            this.setProgress(this.model.getProgress());
			
			return this;
		},
		
		setProgress: function(value) {
	    	$('.header .progressbar > div ').width(value*100+"%");
	    },
		
		_onNext: function() {
			// first save the current input
			this.taskView.setTaskResult();
			
			//check if reached end
			if (this.model.hasReachedEnd()) {
				this.model.setCompleted();
				window.location.hash = "#/record/"+this.model.record.get('id');
			}	
			
			// go forward in model
			this.model.next();
			this.backButtonEnabled = true;
			this.render();
			
			return false;
		},
		
		_onBack: function() {
			if (!this.backButtonEnabled)
				return false;
			// first save the current input
			this.taskView.setTaskResult();
			
			//go back in model
			this.model.back();
			this.backButtonEnabled = false; //only allow to go backwards once
			this.render();
			
			return false;
		},
		
		/* GPS functions */
		
		// function gets called after 45 seconds and checks if there is a position found
		_checkGpsEnabled: function() {
			var self = this;
			
			setTimeout(function() {
				if (!self.closed && self.model !== undefined && !(self.model.currentPosition)) {
					var alertOverlay = new AlertOverlay({
						title:"GPS Problem", 
						text:"Cannot fetch GPS Location. Is GPS enabled?",
						callback : function() {} });
					self.addChildView(alertOverlay);
					alertOverlay.show();
				}
	    	},45000);
			
			
		},
		
		_onNewGpsLocation: function(pos) {
			//console.log('new gps pos received:'+pos.longitude+","+pos.latitude);
			this.model.setGpsPosition(pos);
		},
		
		_onGpsUpdate: function() {
	    	//flash gps icon for a second
	    	$('.icon.gps').addClass('update');
	    	setTimeout(function() {
	    		$('.icon.gps').removeClass('update');
	    	},2000);
	    }
	});
	// Our module now returns our view
	return WalkView;
	
});