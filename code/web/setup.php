
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>De-Routing Setup</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="css/style_admin.css">
  </head>
  <body>
  <div class="admin-container">
<?php

    require 'api/config.php';

    echo "<h1>De-Routing Setup</h1>";
    echo "<ul>";

    printTestResult("Database Connection Test",testDatabaseConnection());
    printTestResult("Create Database Tables",createDatabaseTables());
    printTestResult("Check Data Directory",testDataDirWritable());
    printTestResult("Insert Test Data",insertTestExplorations());
    //printTestResult("Test Web Api",testWebApi());

    echo "</ul>";

    

    function testDatabaseConnection() {
        try {
            $db = getConnection();
        } catch(PDOException $e) {
            return array("passed" => false, "message" => $e->GetMessage());
        }
        return array("passed" => true, "message" => "Database connection successfullly established.");
    }

    function createDatabaseTables() {
        try {
            $db = getConnection();
            $stmt = $db->prepare("
                CREATE TABLE `".DB_TABLE_EXPLORATIONS."` (
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `name` varchar(50) DEFAULT NULL,
                    `json` text,
                    `visible` tinyint(1) NOT NULL DEFAULT '1',
                    `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`id`)
                ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

                CREATE TABLE `".DB_TABLE_RECORDS."` (
                    `id` varchar(36) NOT NULL,
                    `exploration_id` int(11) DEFAULT NULL,
                    `explorer` varchar(50),
                    `completed` tinyint(1) DEFAULT '1',
                    `submitted` tinyint(1) DEFAULT '0',
                    `tasks` text,
                    `route` text,
                    `area` text,
                    `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    `visible` tinyint(1) DEFAULT '1',
                    UNIQUE KEY `id` (`id`)
                ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
            ");
            $stmt->execute();
            $db = null;
        }catch(PDOException $e) {
            return array("passed" => false, "message" => $e->GetMessage());
        }
        return array("passed" => true, "message" => "Database tables created.");
    }

    function testDataDirWritable() {
        try {
            if(is_writable(DIR_RECORD_FILES))
                return array("passed" => true, "message" => "Data Directory is writable.");
            else
                return array("passed" => false, "message" => "Data Directory is not writable. Change permissions.");
        } catch(Exception $e) {
            return array("passed" => false, "message" => $e->GetMessage());
        }
    }

    function insertTestExplorations() {
        try {
            $db = getConnection();
            $stmt = $db->prepare("
                INSERT INTO `".DB_TABLE_EXPLORATIONS."` (`id`, `name`, `json`, `visible`, `created_time`)
                VALUES
                    (1,'Manual','{\"name\":\"Manual\",\"description\":\"This is a short introduction for workshop participants on how to use the app.\",\"title\":\"Anleitung fu00fcr De-Routing App\",\"briefing\":\"A short introduction for workshop participants on how to use the app\",\"tasklist\":[{\"title\":\"Task\",\"subtasks\":[{\"text\":\"This is a task description. Click on the Accept Button on the bottom left to proceed\",\"action\":\"none\"},{\"text\":\"Try to use the slider.\",\"action\":\"slider\",\"start\":\"like it.\",\"end\":\"dont like it\"},{\"text\":\"Press the camera button below to take a picture.\",\"action\":\"picture\"},{\"text\":\"Take a video with the video button.\",\"action\":\"video\"},{\"text\":\"Make an audio recording\",\"action\":\"audio\"},{\"text\":\"Type in a text in the text field below.\",\"action\":\"text\"}],\"id\":0}],\"area\":{\"longitude\":15.407042,\"latitude\":52.513152,\"radius\":500},\"directions\":[{\"text\":\"Turn left on the next street, then walk 50 meters.\",\"type\":\"left\"},{\"text\":\"Turn left on the next street, then walk 100 meters.\",\"type\":\"left\"},{\"text\":\"Turn left on the next street, then walk 200 meters.\",\"type\":\"left\"},{\"text\":\"Turn right on the next street, then walk 50 meters.\",\"type\":\"right\"},{\"text\":\"Turn right on the next street, then walk 100 meters.\",\"type\":\"right\"},{\"text\":\"Turn right on the next street, then walk 200 meters.\",\"type\":\"right\"},{\"text\":\"Follow your street for 2 minutes.\",\"type\":\"forward\"},{\"text\":\"Follow your street for 200 meters.\",\"type\":\"forward\"},{\"text\":\"Go to the next green area.\",\"type\":\"undirected\"}]}',1,'2014-08-22 18:19:51'),
                    (2,'Mehringplatz Test','{\"name\":\"Mehringplatz Test\",\"description\":\"This is the first test-exploration for the smartphone supported de-routing workshop.\",\"perspectives\":[{\"name\":\"ambivalence\",\"title\":\"Mapping Ambivalence\",\"briefing\":\"simultaneous and contradictory attitues and feelings / continual fluctuation / uncertainty as to which approach to follow\",\"tasks\":[1,2,3,4,5,6,7,8,9,10,11,12]}],\"tasklist\":[{\"id\":1,\"title\":\"Task\",\"subtasks\":[{\"text\":\"Photograph something ambivalent in the next 20 meters on the street.\",\"action\":\"picture\",\"length\":20}]},{\"id\":2,\"title\":\"Task\",\"subtasks\":[{\"action\":\"mapping\"}]},{\"id\":3,\"title\":\"Task\",\"subtasks\":[{\"text\":\"How does this space make you feel?\",\"action\":\"slider\",\"start\":\"comfortable\",\"end\":\"uncomfortable\"},{\"text\":\"How does this space make you feel?\",\"action\":\"slider\",\"start\":\"safe\",\"end\":\"unsafe\"},{\"text\":\"How does this space make you feel?\",\"action\":\"slider\",\"start\":\"misplaced\",\"end\":\"not misplaced\"}]},{\"id\":4,\"title\":\"Task\",\"subtasks\":[{\"text\":\"Ask someone to take a picture of you.\",\"action\":\"picture\"},{\"action\":\"text\",\"text\":\"Who did you ask?\"},{\"action\":\"text\",\"text\":\"Why did you ask that person?\"},{\"action\":\"text\",\"text\":\"Notes of the encounter:\"}]},{\"id\":5,\"title\":\"Task\",\"subtasks\":[{\"action\":\"picture\",\"text\":\"Take a photograph that shows an ambivalent relationship between a thing and another thing.\"},{\"action\":\"picture\",\"text\":\"Now take a photograph that shows an ambivalent relationship between a thing and a person. (if there are people around)\"}]},{\"id\":6,\"title\":\"Task\",\"subtasks\":[{\"text\":\"How would you characterize the space in terms of beeing Homogeneous or Heterogeneous?\",\"action\":\"slider\",\"start\":\"homogen.\",\"end\":\"heterogen.\"},{\"text\":\"How would you characterize the space in terms of beeing:\",\"action\":\"slider\",\"start\":\"social\",\"end\":\"not social\"},{\"text\":\"How would you characterize the space in terms of beeing:\",\"action\":\"slider\",\"start\":\"finished\",\"end\":\"unfinished\"}]},{\"id\":7,\"title\":\"Task\",\"subtasks\":[{\"action\":\"audio\",\"text\":\"Record the sound of your environment around you. (20 seconds)\",\"length\":20},{\"action\":\"mapping\",\"text\":\"Map all the sounds that you can hear in a 10 meter radius.\"}]},{\"id\":8,\"title\":\"Task\",\"subtasks\":[{\"action\":\"none\",\"text\":\"Take a photograph of the three most ambivalent things that you can see from where you stand.\"},{\"action\":\"picture\",\"text\":\"Take Picture 1\",\"length\":1},{\"action\":\"picture\",\"text\":\"Take Picture 2\",\"length\":1},{\"action\":\"picture\",\"text\":\"Take Picture 3\",\"length\":1}]},{\"id\":9,\"title\":\"Task\",\"subtasks\":[{\"action\":\"none\",\"text\":\"Ask someone for directions to the Jewish Museum in Berlin.\"},{\"action\":\"text\",\"text\":\"Who did you ask?\"},{\"action\":\"text\",\"text\":\"Why did you ask that person?\"},{\"action\":\"text\",\"text\":\"Notes of the encounter:\"}]},{\"id\":10,\"title\":\"Task\",\"subtasks\":[{\"text\":\"How would you characterize the space in terms of beeing:\",\"action\":\"slider\",\"start\":\"rich\",\"end\":\"poor\"},{\"text\":\"How would you characterize the space in terms of beeing:\",\"action\":\"slider\",\"start\":\"clean\",\"end\":\"dirty\"},{\"text\":\"How would you characterize the space in terms of beeing:\",\"action\":\"slider\",\"start\":\"accessible\",\"end\":\"inaccessible\"}]},{\"id\":11,\"title\":\"Task\",\"subtasks\":[{\"action\":\"audio\",\"text\":\"Describe how this space makes you feel and why. (60 seconds)\",\"length\":60}]},{\"id\":12,\"title\":\"Task\",\"subtasks\":[{\"action\":\"video\",\"text\":\"Make a video that captures a specific mood in 15 seconds.\",\"length\":15}]}],\"area\":{\"longitude\":13.392438,\"latitude\":52.499347,\"radius\":300},\"directions\":[{\"type\":\"left\",\"texts\":[\"Go left on the next street.\"]},{\"type\":\"right\",\"texts\":[\"Go right on the next street.\"]},{\"type\":\"forward\",\"texts\":[\"Then walk 50 meters.\",\"Then walk 20 meters.\",\"Then walk 10 meters.\",\"Then walk 5 meters.\",\"Then walk 1 meter.\"]}]}',1,'2014-02-14 11:49:18');
                ;
            ");
            $stmt->execute();
            $db = null;
        } catch(Exception $e) {
            return array("passed" => false, "message" => $e->GetMessage());
        }
        return array("passed" => true, "message" => "Test explorations inserted.");
    }

    function testWebApi() {
        $response = false;
        try {
            $response = file_get_contents("api/explorations");
        } catch(Exception $e) {
            return array("passed" => false, "message" => $e->GetMessage());
        }
        return array("passed" => true, "message" => $response);
    }


    function printTestResult($testTitle, $result) {
        if ($result['passed'])
            echo "<li>".$testTitle.": ".$result["message"]."</li>";
        else
            echo "<li style=\"color:#f00\"> ERROR! ".$testTitle.": ".$result["message"]."</li>";
    }

    function getConnection() {
        $dbhost=DB_SERVER;
        $dbuser=DB_USER;
        $dbpass=DB_PASSWORD;
        $dbname=DB_DATABASE;
        $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    }

?>
    </div>

  </body>
</html>
