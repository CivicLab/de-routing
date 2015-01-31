define([], function(){
	var CONSTANTS = {

			// server settings
			SETTING_WEB_TIMEOUT : 2000,

			DIRECTIONS_PROBABILITY_TURN : 1, //make a turn
			DIRECTIONS_PROBABILITY_FORWARD : 1, //walk straight
			DIRECTIONS_PROBABILITY_SPECIAL : 0, //find sth special
			
			MAX_FILE_SIZE: 25 * 1024 * 1024 //max file size is 25 MB 

	};
	return CONSTANTS;
});