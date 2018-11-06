<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once('config/database.php');
include_once ('objects/track.php');


// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
error_log("is db empty???");
if(empty($db)){

    error_log("getConnection from Database object doesn't work bruh");
}


// initialize object
$track = new track($db);

// query products
$placeName;
if (isset($_GET['placemarkName'])) {
    $placeName = $_GET['placemarkName'];
} else {
    // Fallback behaviour goes here
    echo "There was an error getting your track(s).";
    error_log("something went wrong getting the param from the url");
}
$stmt = $track->read($placeName);
if(empty($stmt)){

  error_log("nothig was returned from track->read() ooops");
}

$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){

    // products array
    $track_arr=array();
    $tracks_arr["tracks"]=array();

    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);

        $track_item=array(
            "sound_id" => $sound_id,
            "track_volume" => $track_volume,
            "track_number" => $track_number,
            "track_identifier" =>$track_identifier,
            "track_name" => $track_name,
            "sound_path" => $sound_path,
            "valley_type" => $valley_type,
            "audio_type" => $audio_type,
            "placemark_name" => $placemark_name,
            "timed_track" => $timed_track,
            "if_yes_when" => $if_yes_when,
            "one_line_desc" => $one_line_desc
        );
        array_push($tracks_arr["tracks"], $track_item);
    }

    echo json_encode($tracks_arr);
}

else{
    echo json_encode(
        array("message" => "No products found.")
    );
}
?>
