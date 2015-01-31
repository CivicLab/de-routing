<?php

	// CHANGE THESE SETTINGS TO POINT TO YOUR DATABASE 
	/*define('DB_USER', "root"); // db user
	define('DB_PASSWORD', "root"); // db password (mention your db password here)
	define('DB_DATABASE', "cultural_probe"); // database name
	define('DB_SERVER', "localhost"); // db server*/

	define('DB_USER', ""); // db user
	define('DB_PASSWORD', ""); // db password (mention your db password here)
	define('DB_DATABASE', ""); // database name
	define('DB_SERVER', ""); // db server
	
	// CHANGE THESE SETTINGS TO PROTECT YOUR DATA
	define('USE_ADMIN_LOGIN',false); // if there are problems with the authentification mechanism turn this to false
	define('ADMIN_USERNAME',"admin"); // username for admin interface
	define('ADMIN_PASSWORD',"1234"); //password for admin interface

	/* 
		NO NEED TO CHANGE ANYTHING BELOW THIS LINE
	 	------------------------------------------
	*/
	
	define('DB_TABLE_EXPLORATIONS',"explorations_demo");
	define('DB_TABLE_RECORDS',"records_demo");

	define('DIR_RECORD_FILES',"../data/records/");
	
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL | E_STRICT);

