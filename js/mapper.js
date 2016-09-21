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
var url; // Used to point at KML files.
var kml; // this will refer to the DOM of the current KML file.
var placemarksDOM;
//var allCoordinatesArray = [];	// This is an array with just the coordinates of all the placemarks. Necessary for the PointInPoly function.
var trackerId = 0;
var counter = 0;

var start_stop_btn, wpid=false, map, z, op, prev_lat, prev_long, min_speed=0, max_speed=0, min_altitude=0, max_altitude=0;
distance_travelled=0, min_accuracy=150, date_pos_updated="", info_string="";

var index = 0;

function coordinatePair(x, y) {
	this.x = x;
	this.y = y;
}  
//	coordinatePair.prototype.show = function() {
//		alert(this.x + ': ' + this.y);
//	}

var currentUserCoordinates = new coordinatePair(0,0);



//var currentUserCoordinates = new coordinatePair(1,1); 
//currentUserCoordinates.show();

//function placemark(name, description) {
//   this.name = name;
//   this.description = description;
//}


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
	allCoordinatesArray = new Array();
	window.alert("About to parse: "+url);
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
			window.kml = xmlhttp.responseXML;
			window.placemarksDOM = window.kml.getElementsByTagName("Placemark");
			alert("Number of placemarks found: "+window.placemarksDOM.length);
			allCoordinatesArray = new Array();
			for (i=0;i<window.placemarksDOM.length;i++)
				{
				var ring = new Array();
				coordinatesDOM=window.placemarksDOM[i].getElementsByTagName("coordinates");
				var coordsText = coordinatesDOM[0].firstChild.nodeValue;
				coordsText=coordsText.replace(/\s+/g," "); // tidy the whitespace
				coordsText=coordsText.replace(/^ /,"");    // remove possible leading whitespace
				coordsText=coordsText.replace(/ $/,"");    // remove possible trailing whitespace
				coordsText=coordsText.replace(/, /,",");   // tidy the commas
				var coordStrings = coordsText.split( ' ' );
				
				for ( var coordText in coordStrings )
					{
					var coordinate = new Array();
					var coordSplit = coordStrings[ coordText ].split( ',' );
					coordinate['x'] = parseFloat(coordSplit[0]);
					coordinate['y'] = parseFloat(coordSplit[1]);
					//var piet = new coordinatePair(coordSplit[0],coordSplit[1]);
					ring.push(coordinate);
					}
				alert("pushing new polygon to array");
				//alert(dump(ring));
				allCoordinatesArray.push( ring );
				}
				
			alert(dump(allCoordinatesArray));
			alert("Parsing is done");
			//return allCoordinatesArray;	
			//compare();
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



	};

	function geo_error(err){

		//this gets called if there is a problem updating the users position

		console.log(err);
		alert("There was an error monitoring your coordinates.");

	};



	if(!!navigator.geolocation)
		{
			alert("Booting up GPS");
			//setTimeout(function () {

			//TODO define geo_success, geo_error 
			wpid=navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
			//	}, 100);
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
function compare()
	{
	alert("Comparing user location to KML data");
	//alert(dump(allCoordinatesArray));
	//alert(dump(currentUserCoordinates));	
	
	if (window.kml)
		{

		var lastFoundPlacemark = -1;
		document.getElementById('currentpos').innerHTML = dump(currentUserCoordinates);

		window.counter++;
		document.getElementById('counter').innerHTML = window.counter;
		
		//isUserInPlacemark(window.allCoordinatesArray, window.currentUserCoordinates);
		//lastFoundPlacemark = isUserInPlacemark(window.allCoordinatesArray, window.currentUserCoordinates);
		

		for (var i in allCoordinatesArray)
			{
			//alert("!!checking point in polygon for polygon "+i);
			//is this supposed to be window.isPointInPoly or is it supposed to be only isPointInPoly -Boyan
			if(window.isPointInPoly(allCoordinatesArray[i],currentUserCoordinates))
				{
				lastFoundPlacemark = i;
				}
			}

		alert("The number of the last found placemark: "+lastFoundPlacemark);
		
		if (lastFoundPlacemark != -1)
			{
			//window.placemarksDOM=xmlDoc.getElementsByTagName("Placemark");
			var description=window.placemarksDOM[lastFoundPlacemark].getElementsByTagName("description");
			var name=window.placemarksDOM[lastFoundPlacemark].getElementsByTagName("name");
			display(name[0].firstChild.nodeValue, description[0].firstChild.nodeValue);
			}	
		}
	}	


// When the DOM of the parent document is fully complete, jquery runs this function. This runs before init().
$(document).ready(function(){
	alert("Document is ready\n");
	
	// Load KML (and extract allCoordinatesArray from it)
	// window.url = gup('url');
	// window.allCoordinatesArray = parseNewKML(window.url);

	//TODO there are cross origin requests errors because we are not hosting the site anywhere. 
	// I need to ask If i should just test it out and host it somewhere.
	//Same thing with getting the gps location. the browser is worried about security risks so it won't give you gps coordinates.

	window.url = "assets/map.kml";
	allCoordinatesArray = parseNewKML(window.url);

	//Does parseNewKML return a value??





	//ignore this stuff

	/*console.log(allCoordinatesArray);
	navigator.geolocation.getCurrentPosition(function(pos){

		console.log(pos);





	},function(error){

		console.log(error);

	});
	*/
	
	}); // einde van de compare ready function van jquery.

