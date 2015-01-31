define([
        'jquery'
], function($){
	
	var Utils = {
		
		// binds an event staying in the scopes context
		bind: function(scope, fn) {
		    return function () {
		        fn.apply(scope, arguments);
		    };
		},
		
		// check if a file exists
		fileExists: function(uri,callback) {
			
			//window.resolveLocalFileSystemURI(uri,exists,notExists);
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				fileSystem.root.getFile(uri, { create: false }, exists, notExists);
			},notExists);
			
			function exists() {
				callback(true);
			};
			
			function notExists() {
				callback(false);
			};
		},
		
		getFileInfo: function(uri,callback) {
			
			var path = uri.replace(/^file:/, '');
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				fileSystem.root.getFile(path, { create: false }, exists, notExists);
			},notExists);
			
			function exists(fileEntry) {
				fileEntry.getMetadata(function(metaData) {
					callback(true,metaData);
				},notExists);
			};
			
			function notExists() {
				callback(false);
			};
		},
		
		shuffle: function(array) {
			var currentIndex = array.length, temporaryValue, randomIndex ;
			
			// While there remain elements to shuffle...
			while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}
		
	};
	
	return Utils;
});

