define([
        'jquery',
        'values/constants',
        'values/language'
], function($,CONSTANTS,LANGUAGE){

	var ExplorationDownloader = function(id) {

		this.initialize = function() {
			
			/*$.ajaxSetup({
				timeout: CONSTANTS.SETTING_WEB_TIMEOUT
			});*/

			// enable cross origin resource sharing
			$.support.cors=true;
		};

		this.initialize();

		//downloads experiment from webserver
		this.downloadExploration = function(successCallback,errorCallback,progressCallback) {

			//send request to download exploration data
			request = $.ajax({
				url: CONSTANTS.SETTING_WEB_SERVICE_URL+"/explorations/"+id,
				type: "get",
				dataType: "json",
				timeout: CONSTANTS.SETTING_WEB_TIMEOUT,
				success: onSuccess,
				error: onError
			});

			function onSuccess(data) {
				stopTimers();
				if (data.result == 0)
					errorCallback(data.error);
				else
					successCallback(data);
			};

			function onError(error) {
				stopTimers();
				errorCallback("Error: "+error.responseText);
				//console.log(error);
			};

			function stopTimers() {
				clearTimeout(self.intervalTimer);
				clearTimeout(self.timeoutTimer);
			};

			// start progress timer
			self.runningTime = 0;
			self.intervalTimer = setInterval(function() {
				self.runningTime += 100;
				progressCallback(self.runningTime/CONSTANTS.SETTING_WEB_TIMEOUT);
			},100);

			// end timer;
			self.timeoutTimer = setTimeout(function() {
				clearTimeout(self.intervalTimer);
			},self.TIMEOUT+100);

		};
	};
	
	return ExplorationDownloader;
});