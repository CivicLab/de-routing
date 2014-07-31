define([
        'jquery'
], function($){

	var GpsLocation = function() {
		
		this.initialize = function() {
			
			this.lastPos = null;
			this.watcher = null;
			this.GEO_OPTIONS = { maximumAge: 20000, timeout: 20000, enableHighAccuracy: true };
			this.GEO_TIMEOUT = 100000;
			this.GEO_INTERVAL = 7500;
			
			this.newPosEvent = null;
			this.lastUpdateTime = 0;
			
		};
		
		this.initialize();
		
		this.getLocation = function() {
			
			if (this.lastPos != null) {
				this.lastPos.time = this.now();
			}
			return this.lastPos;
	    };
		
	    //start watching
	    this.start = function(newPosCallback,updateCallback) {
			var self = this;
			
			if (self.watcher == null) {
				self.watcher = setInterval(function(){
					
					navigator.geolocation.getCurrentPosition(function(position) {
						
						var newPos = { 
		    					"longitude" : position.coords.longitude, 
		    					"latitude" : position.coords.latitude,
		    					"gpstime" : position.timestamp,
		    					"heading" : position.coords.heading
		    			};
		        		
		        		if (self.lastPos == null || self.lastPos.gpstime != newPos.gpstime) {
		        			self.lastPos = newPos;
		        			self.lastUpdateTime = self.now();
		        			if (newPosCallback !== undefined)
		        				newPosCallback(self.lastPos);
		        		};
		        		
		        		if (updateCallback !== undefined) {
		        			updateCallback();
		        		};
						
					},null,self.GEO_OPTIONS);
					
				},self.GEO_INTERVAL);
			};
	    	
	    };
	    
	    // stop watching
	    this.stop = function() {
	    	if (this.watcher != null) {
	            clearInterval(this.watcher);
	            this.watcher = null;
	        }
	    };
	    
	    this.resetLocation = function() {
	    	this.lastPos = null;
	    };
	    
	    this.now = function() {
	    	return (new Date()).toISOString();
	    };
		
	};
	
	return GpsLocation;
});