define([
        'jquery',
        'underscore',
        'values/constants',
        'values/language',
        'models/SettingsModel',
        'helpers/Utils'
], function($,_,CONSTANTS,LANGUAGE, SettingsModel, Utils){

	var RecordUploader = function(record) {
		
		this.sendRecordData = function(successCallback,errorCallback) {
			var self = this;
			
			//first tell the server about the incoming file transfer and transmit the json data
			request = $.ajax({
				url: record.get('service_url')+"/records/submit",
				type: "post",
				dataType: "json",
				data: {"record" : JSON.stringify(record.attributes), files: [] },
				timeout: CONSTANTS.SETTING_WEB_TIMEOUT,
				// call this function on success
				success: function(data) {
					//server sends back the list of files needed to upload
					//format { files: [ {uri: "path on device"}, ... ] }
					successCallback(data); 
				},
				//call this funcion on fail
			    error: function(error) {
			    	errorCallback(LANGUAGE.WEB_CONNECTION_ERROR);
			    }
			});
		};
		
		
		this.uploadFiles = function(files,successCallback,errorCallback,progressCallback) {
			var self = this;
			
			if (files.length <= 0)
				successCallback();
			
			var fileIndex = 0;
			loopFileArray(files);
			
			function loopFileArray(arr) {
				
				progressCallback(fileIndex/files.length); //update progress
				
				if(fileIndex >= arr.length) {
		        	successCallback(LANGUAGE.WEB_UPLOAD_SUCCESSFULL); //upload finished
		        	return;
		        }
				
				// first check file
				self._ckeckFile(arr[fileIndex].uri, function(result) {
					// upload file if its valid
					if (result) {
						
						self._uploadFile(arr[fileIndex],record,
							function() { // on success
								fileIndex++;
								loopFileArray(arr); //upload next file
							},
							function(error) { // on fail
								errorCallback(error);
							},
							function(fileProgress) { // send file progress
								progressCallback((fileIndex + fileProgress)/arr.length);
							}
						);
					//else just proceed to the next file
					} else {
						
						fileIndex++;
						loopFileArray(arr)
					}
				}); // end of checkFiles
			}; // end loopfilearray
		}; // end of  uploadFiles
		
		//checks if file exsists and if the file size is not too big
		this._ckeckFile = function(file,callback) {
			Utils.getFileInfo(file,function(exists,fileData) {
				if (exists) {
					if (fileData.size < CONSTANTS.MAX_FILE_SIZE) {
						callback(true)
						return;
					}
				}
				callback(false);
    		});
		};
		
		//uploads a single file
		this._uploadFile = function(file,record,onSuccess,onFail,progressCallback) {
			
			console.log("uploading "+file.uri);
			
			transfer = new FileTransfer();
			
			var options = new FileUploadOptions();
			options.fileKey="file";
            options.fileName=file.name;
			options.chunkedMode = true;
			options.headers = {Connection: "close"};
            var params = { "record_id" : record.get('id')};
            options.params = params;
            
            //start transfer
            transfer.upload(file.uri, record.get('service_url')+"/records/upload" , success, fail, options);
            
            function success(result) {
            	onSuccess(result);
            };
            
            function fail(error) {
				console.log(JSON.stringify(error));
            	onFail(LANGUAGE.WEB_UPLOAD_FAILED);
            };
            
            //update progress
            transfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                	progressCallback(progressEvent.loaded/progressEvent.total);
                }
            };
            
		};
	};
	
	return RecordUploader;
});