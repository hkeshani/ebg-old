// thanks to
// Scott Andrew for inpoly
// egeoxml, whatever it is.

// explanation
/*

There's going to be 1 coordinate in the coordinate field because it makes sense 
to have 1 coordinate for every object in the garden.
The code just check a square around it to see if people are close rather than check a polygon with 
a bunch of coordinates.




*/





var xmlHTTP;
var allCoordinatesArray = new Array();
var placemarkArray = new Array();
var url; // Used to point at KML files.
var kml; // this will refer to the DOM of the current KML file.
var nearestPlacemark;

var start_stop_btn, wpid=false, map, z, op, prev_lat, prev_long, min_speed=0, max_speed=0, min_altitude=0, max_altitude=0;
distance_travelled=0, min_accuracy=150, date_pos_updated="", info_string="";
var currentUserCoordinates;



/*function user(latitude,longitude,currentPlacemark){
    this.latitude = latitude;
    this.longitude = longitude;
    this.currentPlacemark = currentPlacemark;
}
*/


var user = {
    'latitude':-100000,
    'longitude':-100000,
    'currentPlacemark':{"name": "no current placemarks nearby"}   
	    };

//console.log("THIS IS USER BELOW--------------------------------------");
//console.log(user1);

function NearestPlacemarkToUser(userCoords, placemarkArray ){

    //With this function you need just 1 set of coordinates per placemark 
    //in the kml file
    //it makes it easier for whoever is figuring out the coodinates of the placemarks
    //instead of 4+ points to find for a polygon, they just need one.
    //then I check a small square around those coordinates to see if the user is close to the placemark.
    
    //check a square around the points
    var placemarkLatitude = 0; 
    var placemarkLongitude = 0;
    var squareLength = 0.003; // in degrees in latitude and longitude
    //CHANGE squareLength if you want the square around each point to be smaller


    var halfSquareLength = (squareLength * 1.0 /2);
    console.log(halfSquareLength);
    var nearFlag = false;
    nearestPlacemark = {'name':'not near any placemarks'};
    //console.log(placemarkArray);
    for(var i = 0 ; i < placemarkArray.length; i++){
	placemarkLatitude = placemarkArray[i].latitude;
	placemarkLongitude = placemarkArray[i].longitude;
	//console.log('-------------------------');
	//console.log(placemarkLatitude);
	//console.log('--------------------------');
	//console.log(placemarkLongitude);
	

    
	if (userCoords.latitude < placemarkLatitude + halfSquareLength){

	    if(userCoords.latitude >= placemarkLatitude - halfSquareLength){
	    
		if(userCoords.longitude >= placemarkLongitude - halfSquareLength){
		
		    if(userCoords.longitude <= placemarkLongitude + halfSquareLength ){

			nearFlag = true;
			nearestPlacemark = placemarkArray[i];
			//var audio = document.getElementsByTagName('audio')[0];
			//if(audio.currentTime <= 0 || audio.currentTime === audio.duration){
			//    audio.play();
			//}
			    break;
		    }
	    
		}

	    }


	}
    }
    //console.log("nearestPlacemark");
    //console.log(nearestPlacemark);
    return nearestPlacemark;

}
// This function scrapes parameter data from the browser's URL string.
function gup( name )
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
    {
	return "";
    }
    else
    {
	return results[1];
    }
}



// Load KML data into the document, and also extract the polygon data into an array.
function parseNewKML(url)
{
    //console.log("Am i running? : " + url );
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function()
    {
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
	    kml = xmlhttp.responseXML;
	    var listOfPlacemarks = kml.getElementsByTagName("Placemark");
	    //console.log(listOfPlacemarks);
	    //alert("Number of placemarks found: " + listOfPlacemarks.length);

	    for (var i = 0; i < listOfPlacemarks.length ; i++)
	    {
		var placemark = new Object();
		var coordinates = listOfPlacemarks[i].getElementsByTagName("coordinates")[0].textContent;
		//console.log(coordinates);    
		var coordArray = coordinates.replace(/(\s+)/g,"").split(',');
		
		//console.log("NEW COORDS CHECK IF THESE WORK.");
		//console.log(coordArray);
		placemark["name"] = listOfPlacemarks[i].getElementsByTagName("name")[0].textContent;
		//console.log(placemark["name"]);
		placemark["latitude"] = parseFloat(coordArray[0]);
		placemark["longitude"] = parseFloat(coordArray[1]);
		
		placemarkArray.push(placemark);

	    }
	    
	    //console.log(placemarkArray);
	    startGPS();
	    //afterKMLparsing()			
	}
	
    }

    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}


function startGPS()
{


    //this function does more than start the GPS.
    //calling watchPosition means it is constantly updating the users postion.


    function geo_success(position){
	//this gets called everytime the gps updates the users position.

	currentUserCoordinates = position.coords;


	currentUserCoordinates = position.coords;
	var debug = document.getElementById("debug");
	if(debug){
	    debug.innerHTML = 'Latitude : ' + currentUserCoordinates.latitude + " Longitude: " + currentUserCoordinates.longitude;
	    debug.innerHTML += '</br> speed: ' + currentUserCoordinates.speed;
	    debug.innerHTML += '</br> near Placemark: ' + NearestPlacemarkToUser(currentUserCoordinates, placemarkArray).name;
	    debug.innerHTML += "</br> placemarks:";
	    for(var k =  0 ; k < placemarkArray.length ; k++){


	    
		debug.innerHTML+= "</br> Name : "+placemarkArray[k].name;
		debug.innerHTML+= " </br> coords: "+placemarkArray[k].latitude + "     " + placemarkArray[k].longitude;
		debug.innerHTML+="</br>";
	    }
	}
	user.currentPlacemark = NearestPlacemarkToUser(currentUserCoordinates,placemarkArray);
	user.latitude = currentUserCoordinates.latiude;
	user.longitude = currentUserCoordinates.longitude;
    };

    function geo_error(err){

	//this gets called if there is a problem updating the users position

	console.log(err);
	alert("There was an error monitoring your coordinates.");

    };



    if(navigator.geolocation)
    {
	wpid=navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:3000, timeout:27000});
    }
    else
    {
	display("Sorry", "Your Browser doesnt seem capable of figuring out where on earth it is.");
    }	
}


// DISPLAY
function display(name,description){
    document.getElementById('displayName').innerHTML = name;
    document.getElementById('displayDescription').innerHTML = description;
}


// When the DOM of the parent document is fully complete, jquery runs this function. This runs before init().
$(document).ready(function(){

    // Load KML (and extract allCoordinatesArray from it)
    // window.url = gup('url');
    // window.allCoordinatesArray = parseNewKML(window.url);

    url = "/assets/map.kml";
    //allCoordinatesArray = parseNewKML(window.url);
    parseNewKML(url);

    //Does parseNewKML return a value??



    url = "/assets/map.kml";
    //allCoordinatesArray = parseNewKML(window.url);
    parseNewKML(url);

    
}); // einde van de compare ready function van jquery.

