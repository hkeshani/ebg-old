<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body id="home">

   <?php echo '<p>Hello World</p>';

   // include database and object files
   include_once('config/database.php');
   include_once ('objects/track.php');

   //$query = "SELECT placemark_name, track_path FROM islamicgarden.sounds s WHERE s.placemark_name = 'Boyan' ;";

   //error_log("did the query work???");
   //error_log($query);







   ?>



 <div id="tabledivcont">
 <div id="tablediv">
 <table id="table">
 <tr>
     <td colspan="3" class="title">The Contemporary Islamic Garden</td>
   </tr>
 <tr>
 <td class="font"><div id="tourbtn" onclick="tour()">TOUR</div></td>
 <td><div id="vertical1" class="vertical"></div></td>
 <td class="font" onclick="play()"><div>PLAY</div></td>
 </tr>
 <tr>
 <td align="right"><div id="horizontal1"></div></td>
 <td><div id="horizontal2"></div></td>
 <td align="left"><div id="horizontal3"></div></td>
 </tr>

 <tr>
 <td class="font"><div id="learnbtn" onclick="learn()">LEARN</div></td>
 <td><div id="vertical2" class="vertical"></div></td>
 <td class="font" onclick="reflect()"><div>REFLECT</div></td>
 </tr>
 <tr>
     <td colspan="3" class="font" onclick="question()"><div>QUESTION</div></td>
   </tr>
 </table>

 </div>
 </div>

  <div id="container">
   <div id="menubar">
   <span id="homebtn" class="fa fa-home" onclick="home()"></span>
   <span id="mapbtn" class="fa fa-map-marker" onclick="mapOfGarden()"></span>
   <span id="fsbtn" class="fa fa-arrows-alt" onclick="toggleFullScreen()"></span>
   <span id="menubtn" class="fa fa-bars" onclick="dropdown()"></span>
   <div id="myDropdown" class="dropdown-content">
     <a onclick="search()">SEARCH</a>
     <a onclick="about()">ABOUT</a>
     <a onclick="garden()">THE GARDEN</a>
   <a onclick="contact()">CONTACT</a>
   </div>
   </div>
   </div>


 </body>


</html>
