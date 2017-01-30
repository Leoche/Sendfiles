<?php 
if(!isset($_GET["action"])) die(json_encode(array("status"=>"error","message"=>"Page not found")));
switch($_GET["action"]){
	case "get":
	if(!isset($_GET["id"])) die(json_encode(array("status"=>"error","message"=>"Id not found")));
	require "hashids.lib.php";
	$hashids = new Hashids('this is my salt');
	$id = $hashids->decode($_GET["id"]);
	if(!isset($id[0])) die(json_encode(array("status"=>"error","message"=>"Invalid id")));
	$id = intval($id[0]);
	$DB = getDB();
	$query = $DB->query("SELECT * FROM files WHERE id=$id");
	$file = $query->fetchAll(PDO::FETCH_ASSOC);
	if(count($file)==0){
		die(json_encode(array("status"=>"error","message"=>"File not found with id #"+$id)));
	}else{
		$file[0]["size"] = humanFileSize($file[0]["size"]);
		$file[0]["created_at"] = humanDateTime($file[0]["created_at"]);
		$file[0]["path"] = "uploads".DIRECTORY_SEPARATOR.sha1($file[0]["id"]).DIRECTORY_SEPARATOR.$file[0]["name"];
		die(json_encode($file[0]));
	}
	break;
	case "upload":
		if(!isset($_FILES) && !isset($_FILES["file"])) die(json_encode(array("status"=>"error","message"=>"File not sended")));
		if($_FILES["file"]["error"] != 0) die(json_encode(array("status"=>"error","message"=>"Error on upload")));
		if($_FILES["file"]["size"]>31457280) die(json_encode(array("status"=>"error","message"=>"File too big! 30Mb maximum.")));
		$file = $_FILES["file"];
		require "hashids.lib.php";
		$DB = getDB();
		$query = $DB->prepare("INSERT INTO files(name,size,hash,created_at) VALUES (:name,:size,:hash,:created_at)");
		$query->execute(array(
			"name"=>$file["name"],
			"size"=>$file["size"],
			"hash"=>md5_file($file['tmp_name']),
			"created_at"=>date("Y-m-d H:i:s")
		));
		$id = $DB->lastInsertId();
		$hashids = new Hashids('this is my salt');
		$id = $hashids->encode($id);
		mkdir("uploads".DIRECTORY_SEPARATOR.sha1($id));
		move_uploaded_file($file["tmp_name"], "uploads".DIRECTORY_SEPARATOR.sha1($id).DIRECTORY_SEPARATOR.$file["name"]);
		die(json_encode(array("status"=>"success","message"=>$id)));
	break;
}
function getDB(){
	$DB = null;
	try{
		$connexion = 'mysql:host=localhost;dbname=sendfiles';
		$parametres = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
	    $DB = new PDO($connexion, 'root', '', $parametres);
	    $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e) {
	    die('ERREUR PDO dans ' . $e->getFile() . ' ligne ' . $e->getLine() . ' : ' . $e->getMessage());
	}
	return $DB;
}
function humanFileSize($size,$unit="") {
  if( (!$unit && $size >= 1<<30) || $unit == "Gb")
    return number_format($size/(1<<30),2)."Gb";
  if( (!$unit && $size >= 1<<20) || $unit == "Mb")
    return number_format($size/(1<<20),2)."Mb";
  if( (!$unit && $size >= 1<<10) || $unit == "Kb")
    return number_format($size/(1<<10),2)."Kb";
  return number_format($size)." bytes";
}
function humanDateTime($date){
    $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
    $lengths = array("60","60","24","7","4.35","12","10");
    $now = time();
    $unix_date = strtotime($date);
    if(empty($unix_date))   
        return "Bad date";
    if($now > $unix_date) {    
        $difference = $now - $unix_date;
        $tense = "ago";
    } else {
        $difference = $unix_date - $now;
        $tense = "from now";
    }
    for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++)
        $difference /= $lengths[$j];
    $difference = round($difference);
    if($difference != 1)
        $periods[$j].= "s";
    return "$difference $periods[$j] {$tense}";
}
?>