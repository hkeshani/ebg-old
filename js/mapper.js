// thanks to
// Scott Andrew for inpoly
// egeoxml, whatever it is.

// explanation
/*
  This script loads a KML and from that loads all the polygon data into an array called "allCoordinatesArray". 
  It also connects to the GPS of the device to extract the current user coordinates and link them 
  as "x" and "y" to an object called "user". It then compares all these polygons to the current 
  user position.
*/

// VARIABLES


var xmlHTTP;
var allCoordinatesArray = new Array();
var placemarkArray = new Array();
var url; // Used to point at KML files.
var kml; // this will refer to the DOM of the current KML file.
var nearestPlacemark;

var start_stop_btn, wpid=false, map, z, op, prev_lat, prev_long, min_speed=0, max_speed=0, min_altitude=0, max_altitude=0;
distance_travelled=0, min_accuracy=150, date_pos_updated="", info_string="";
var currentUserCoordinates;



function user(x,y,inPlacemark,currentPlacemark){
    this.x = x;
    this.y = y;
    this.inPlacemark = inPlacemark;
    this.currentPlacemark = currentPlacemark;
}





//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
http://jsfromhell.com/math/is-point-in-poly//+ Jonas Raoni Soares Silva

function isPointInPoly(poly, pt)
{
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}



function NearestPlacemarkToUser(userCoords, placemarkArray ){

    //With this function you need just 1 set of coordinates per placemark 
    //in the kml file
    //it makes it easier for whoever is figuring out the coodinates of the placemarks
    //instead of 4+ points to find for a polygon, they just need one.
    //then I check a small square around those coordinates to see if the user is close to the placemark.
    
    //check a square around the points
    var placemarkLatitude = 0; 
    var placemarkLongitude = 0;
    var squareLength = 0.02; // in degrees in latitude and longitude
    //CHANGE squareLength if you want the square around each point to be smaller


    var halfSquareLength = (squareLength/2);
    var nearFlag = false;
    nearestPlacemark = {'name':'not near any placemarks'};
    console.log(placemarkArray);
    for(var i = 0 ; i < placemarkArray.length; i++){
	placemarkLatitude = placemarkArray[i].latitude;
	placemarkLongitude = placemarkArray[i].longitude;
	console.log('-------------------------');
	console.log(placemarkLatitude);
	console.log('--------------------------');
	console.log(placemarkLongitude);
	

    
	if (userCoords.latitude < placemarkLatitude + halfSquareLength){

	    if(userCoords.latitude >= placemarkLatitude - halfSquareLength){
	    
		if(userCoords.longitude >= placemarkLongitude - halfSquareLength){
		
		    if(userCoords.longitude <= placemarkLongitude + halfSquareLength ){

			nearFlag = true;
			nearestPlacemark = placemarkArray[i];
			var audio = document.getElementsByTagName('audio')[0];
			if(audio.currentTime <= 0 || audio.currentTime === audio.duration){
			    audio.play();
			}
			    break;
		    }
	    
		}

	    }


	}
    }
    return nearestPlacemark;


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
    console.log("Am i running? : " + url );
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
<<<<<<< HEAD
	    var listOfPlacemarks = kml.getElementsByTagName("Placemark");
	    console.log(listOfPlacemarks);
	    alert("Number of placemarks found: " + listOfPlacemarks.length);

	    for (var i = 0; i < listOfPlacemarks.length ; i++)
	    {
		var placemark = new Object();
		var coordinates = listOfPlacemarks[i].getElementsByTagName("coordinates")[0].textContent;
		console.log(coordinates);    
		var coordArray = coordinates.replace(/(\s+)/g,"").split(',');
		
		console.log("NEW COORDS CHECK IF THESE WORK.");
		console.log(coordArray);
		placemark["name"] = listOfPlacemarks[i].getElementsByTagName("name")[0].textContent;
		console.log(placemark["name"]);
		placemark["latitude"] = parseFloat(coordArray[0]);
		placemark["longitude"] = parseFloat(coordArray[1]);
		
		placemarkArray.push(placemark);

	    }
	    
	    console.log(placemarkArray);
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
	debug.innerHTML = 'Latitude : ' + currentUserCoordinates.latitude + " Longitude: " + currentUserCoordinates.longitude;
	debug.innerHTML += '</br> speed: ' + currentUserCoordinates.speed;
	debug.innerHTML += '</br> near Placemark: ' + NearestPlacemarkToUser(currentUserCoordinates, placemarkArray).name;

    };

    function geo_error(err){

	//this gets called if there is a problem updating the users position

	console.log(err);
	alert("There was an error monitoring your coordinates.");

    };



    if(navigator.geolocation)
    {
	wpid=navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
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

// This functions compares the KML data to the user's current position.
function compare(){
    //according to the parameters we dont compare anything 
    
    alert("Comparing user location to KML data");
    //alert(dump(allCoordinatesArray));
    //alert(dump(currentUserCoordinates));	
    
    if (window.kml)
    {

	var lastFoundPlacemark = -1;
	//why are we reseting lastFoundPlacemark everytime we compare? 

	document.getElementById('currentpos').innerHTML = dump(currentUserCoordinates);

	counter++;
	document.getElementById('counter').innerHTML = window.counter;
	
	//isUserInPlacemark(window.allCoordinatesArray, window.currentUserCoordinates);
	//lastFoundPlacemark = isUserInPlacemark(window.allCoordinatesArray, window.currentUserCoordinates);
	

	for (var i in allCoordinatesArray)
	{
	    //alert("!!checking point in polygon for polygon "+i);
	    //is this supposed to be window.isPointInPoly or is it supposed to be only isPointInPoly -Boyan
	    if(isPointInPoly(allCoordinatesArray[i],currentUserCoordinates))
	    {
		lastFoundPlacemark = i;
	    }
	}

	alert("The number of the last found placemark: "+lastFoundPlacemark);
	
	if (lastFoundPlacemark != -1)
	{
	    //window.placemarksDOM=xmlDoc.getElementsByTagName("Placemark");
	    var description=placemarksDOM[lastFoundPlacemark].getElementsByTagName("description");
	    var name=placemarksDOM[lastFoundPlacemark].getElementsByTagName("name");
	    display(name[0].firstChild.nodeValue, description[0].firstChild.nodeValue);
	}	
    }
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

