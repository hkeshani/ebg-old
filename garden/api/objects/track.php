<?php
class track{

    // database connection and table name
    private $conn;
    private $table_name = "islamicgarden.sounds";

    // object properties
    public $sound_id;
    public $track_volume;
    public $track_number;
    public $track_identifier;
    public $track_name;
    public $sound_path;
    public $valley_type;
    public $audio_type;
    public $placemark_type;
    public $timed_track;
    public $if_yes_when;
    public $one_line_desc;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
}
