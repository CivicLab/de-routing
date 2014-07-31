<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL | E_STRICT);

	define('DB_USER', "username"); // db user
	define('DB_PASSWORD', "password"); // db password (mention your db password here)
	define('DB_DATABASE', "derouting"); // database name
	define('DB_SERVER', "www.yourhost.com"); // db server

	define('DB_TABLE_EXPLORATIONS',"explorations");
	define('DB_TABLE_RECORDS',"records");

	define('DIR_RECORD_FILES',"../data/records/"); // directory needs writing permissions (chmod 755)
	define('DIR_RECORD_URL',"www.yourhost.com/data/records/");

