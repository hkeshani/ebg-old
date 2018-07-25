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
//var allCoordinatesArray = new Array();

var farAwayPlacemarks = new Array();
var nearbyPlacemarks = [];


var url; // Used to point at KML files.
var kml; // this will refer to the DOM of the current KML file.
var nearestPlacemark;

var start_stop_btn, wpid=false, map, z, op, prev_lat, prev_long, min_speed=0, max_speed=0, min_altitude=0, max_altitude=0;
distance_travelled=0, min_accuracy=150, date_pos_updated="", info_string="";
var currentUserCoordinates;


var defaultBoundary = {width:0.006,
											length:0.006};

var Zones = [];
//each element is a 2 iem long array, [0] = lat, [1] = longitude


/*function user(latitude,longitude,currentPlacemark){
    this.latitude = latitude;
    this.longitude = longitude;
    this.currentPlacemark = currentPlacemark;
}
*/


function isPointInPoly(vs, point)
	{
		// ray-casting algorithm based on
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

		var x = point.latitude, y = point.longitude;

		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				var xi = vs[i][0], yi = vs[i][1];
				var xj = vs[j][0], yj = vs[j][1];

				var intersect = ((yi > y) != (yj > y))
						&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
				if (intersect) inside = !inside;
		}

		return inside;
	}

var user = {
    'latitude':-100000,
    'longitude':-100000,
	    };


//this gets all the placemarks near the user
// function NearestPlacemarksToUser(userCoords, placemarkArray ){
//
//     //check a rectangle around the points
//     var placemarkLatitude = 0;
//     var placemarkLongitude = 0;
//     var rectangleLength;
//     var rectangleWidth;
//     // in degrees in latitude and longitude
//     //CHANGE squareLength if you want the square around each point to be smaller
//
//
//     //var halfSquareLength = (squareLength * 1.0 /2);
//     //console.log(halfSquareLength);
//     var nearFlag = false;
//     nearestPlacemark = {'name':'not near any placemarks'};
//     //var nearestArray = [];
//     //console.log(placemarkArray);
//     for(var i = 0 ; i < placemarkArray.length; i++){
//
//     	if (placemarkArray[i].placemarkType == "placemark"){
//
// 	    		//only 1 coordinate for placemark type so [0]
// 			placemarkLatitude = placemarkArray[i].coordinates[0][0];
// 			placemarkLongitude = placemarkArray[i].coordinates[0][1];
// 			//console.log('-------------------------');
// 			//console.log(placemarkLatitude);
// 			//console.log('--------------------------');
// 			//console.log(placemarkLongitude);
//
//     	}
//
//
// 		rectangleLength = parseFloat(placemarkArray[i].rectangle.length);
// 		console.log(placemarkArray[i]);
// 		rectangleWidth = parseFloat(placemarkArray[i].rectangle.width);
// 		var halfLength = parseFloat(rectangleLength/2);
// 		var halfWidth = parseFloat(rectangleWidth/2);
//
// 		if (userCoords.latitude < placemarkLatitude + halfLength){
//
// 		    if(userCoords.latitude >= placemarkLatitude - halfLength){
//
// 				if(userCoords.longitude >= placemarkLongitude - halfWidth){
//
// 			   		if(userCoords.longitude <= placemarkLongitude + halfWidth ){
//
// 						nearFlag = true;
// 						nearbyPlacemarks.push(placemarkArray.splice(i,1)[0]);
// 						//console.log(farAwayPlacemarks);
// 						//console.log(nearbyPlacemarks);
//
// 					}
//
// 				}
//
// 			}
//
// 		}
//
//     }
//     if(nearbyPlacemarks.length > 1){
// 							removeFarAwayPlacemarks(userCoords,nearbyPlacemarks);
// 	}
//
// }

function NearestPlacemarksToUser(userCoords, placemarkArray ){

	console.log("	FINDING NEAREST PLACEMARKS");
	for(var i = 0 ; i < placemarkArray.length; i++){
		console.log(placemarkArray[i].name);
		console.log(placemarkArray[i].coordinates);
		console.log(isPointInPoly(placemarkArray[i].coordinates,userCoords));
		console.log(userCoords);
		if(placemarkArray[i].zone_type=="zone"){
			if (isPointInPoly(placemarkArray[i].coordinates,userCoords)){

				nearbyPlacemarks.push(placemarkArray.splice(i,1)[0]);
				//placemarkArray has placemarkObjects with .coordinates for coords

			}

		}else{

			//when placemarks are just a dot on the map.

			placemarkLatitude = placemarkArray[i].coordinates[0][0];
			placemarkLongitude = placemarkArray[i].coordinates[0][1];



			if (userCoords.latitude < placemarkLatitude + 0.005){

		    if(userCoords.latitude >= placemarkLatitude - 0.005){

					if(userCoords.longitude >= placemarkLongitude - 0.005){

			   		if(userCoords.longitude <= placemarkLongitude + 0.005 ){

						nearFlag = true;
						nearbyPlacemarks.push(placemarkArray.splice(i,1)[0]);

					}

				}

			}

		}



		}

	}//end for loop



	if (nearbyPlacemarks.length > 1){


		removeFarAwayPlacemarks(userCoords,nearbyPlacemarks);

	}



}



//This function is used to remove placemarks that are no longer near the user
function removeFarAwayPlacemarks(userCoords, nearPlacemarks){

	//console.log("mapper remove Far away");
	//console.log(nearPlacemarks);

    for(var i = 0 ; i < nearPlacemarks.length; i++){

    	if(nearPlacemarks[i]["placemarkType"]=='zone'){

    		if(!isPointInPoly(nearPlacemarks[i]['coordinates'],user)){
    			farAwayPlacemarks.push(nearPlacemarks.splice(i,1)[0]);

    		}

    	}
    	else{

			var placemarkLatitude = nearPlacemarks[i].latitude;
			var placemarkLongitude = nearPlacemarks[i].longitude;

			var rectangleLength = nearPlacemarks[i].rectangle.length;
			var rectangleWidth = nearPlacemarks[i].rectangle.width;
			var halfLength = parseFloat(rectangleLength/2);
			var halfWidth = parseFloat(rectangleWidth/2);

			var farAwayFlag = false;

			if (userCoords.latitude < placemarkLatitude + halfLength){

			    if(userCoords.latitude >= placemarkLatitude - halfLength){

					if(userCoords.longitude >= placemarkLongitude - halfWidth){

				   		if(userCoords.longitude <= placemarkLongitude + halfWidth ){

							continue;


						}
						else{
							farAwayFlag = true;

						}

					}
					else{
						farAwayFlag = true;

					}

				}
				else {

					farAwayFlag = true;

				}

			}
			else{

				farAwayFlag = true;

			}

			if(farAwayFlag){

				farAwayPlacemarks.push(nearPlacemarks.splice(i,1)[0]);

			}

		}

	}




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
	    console.log(listOfPlacemarks);
	    //alert("Number of placemarks found: " + listOfPlacemarks.length);

	    for (var i = 0; i < listOfPlacemarks.length ; i++)
	    {
		var placemark = new Object();
		var coordinates = listOfPlacemarks[i].getElementsByTagName("coordinates")[0].textContent;
		var coordString = coordinates.replace(/(\h+)/g,"");
		//console.log(listOfPlacemarks[i].getElementsByTagName("rectangle")[0]);
		var rectangle = listOfPlacemarks[i].getElementsByTagName("rectangle")[0].textContent;
		var rectangleDimensions = rectangle.replace(/(\s+)/g,"").split(",");
		placemark["name"] = listOfPlacemarks[i].getElementsByTagName("name")[0].textContent;

		var regexFindCoords = /-?\d+\.?\d+\s*,\s*-?\d+\.?\d+/g;
		var latLongParser = /-?\d+\.?\d+/g;

		//makes an array of strings
		var coordStringArray = coordString.match(regexFindCoords);
		//get numbers from strings.
		var coordArray = [];

		for(var k = 0; k< coordStringArray.length;k++){

			var result = coordStringArray[k].match(latLongParser).map(Number);
			console.log("MAPPER.JS RESULT OF PARSING COORDINATES:");
			console.log(result);
			coordArray.push(result);


		}

		//Zones have multiple points and placemarks just have one.
		if(coordArray.length > 1){
			console.log("MAPPER----------------");
			console.log(coordArray);
			placemark["placemarkType"] = 'zone';
			var zoneObj = {
				name : placemark['name'],
				coordinateArray: coordArray

			};
			Zones.push(zoneObj);

		}
		else{

			placemark['placemarkType'] = "placemark";

		}

		placemark["coordinates"] = coordArray;
		//placemark["latitude"] = parseFloat(coordArray[0]);
		//placemark["longitude"] = parseFloat(coordArray[1]);
		placemark["rectangle"] = {"length": rectangleDimensions[0] , "width" : rectangleDimensions[1]};
		console.log("after KML parse:");
		console.log(placemark);
		var placemark_type = listOfPlacemarks[i].getElementsByTagName("zone_type")[0].textContent;
		placemark["zone_type"] = placemark_type;
		farAwayPlacemarks.push(placemark);
		setTimeout(function(){ },300);

	    }


	    //console.log("farAwayPlacemarks before GPS: " + farAwayPlacemarks );
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

	currentUserCoordinates = position.coords;
	console.log("CURRENT FAR AWAY PLACEMARKS---------------------------");
	console.log(farAwayPlacemarks);
	console.log("CURRENT NEARBY PLACEMARKS----------------------------");
	console.log(nearbyPlacemarks);
	NearestPlacemarksToUser(currentUserCoordinates,farAwayPlacemarks);
	console.log("geo_success");
	user.latitude = currentUserCoordinates.latitude;
	user.longitude = currentUserCoordinates.longitude;


	var debug = document.getElementById("debug");
	if(debug){
	    debug.innerHTML = 'Latitude : ' + currentUserCoordinates.latitude + " Longitude: " + currentUserCoordinates.longitude;
	    debug.innerHTML += '</br> speed: ' + currentUserCoordinates.speed;
	    debug.innerHTML += '</br> near Placemarks: ';
	    for(var index =0 ; index < nearbyPlacemarks.length;index++){
	    	debug.innerHTML+= nearbyPlacemarks[index].name + ", ";


	    }
	    debug.innerHTML += "</br> far away placemarks:";

	    for(var k =  0 ; k < farAwayPlacemarks.length ; k++){



		debug.innerHTML+= "</br> Name : "+farAwayPlacemarks[k].name;
		debug.innerHTML+= " </br> coords: "+farAwayPlacemarks[k].coordinates;
		debug.innerHTML+="</br>";
	    }
	}





    };

    function geo_error(err){

	//this gets called if there is a problem updating the users position
	console.log('error finding location in mapper.js');
	console.log(err);


    };



    if(navigator.geolocation)
    {
	wpid=navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:3000, timeout:20000});
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


function isPlacemarkNearby(placemarkToCheck){

	var flag = false;


	if(placemarkToCheck["placemarkType"] == 'zone'){

		return isPointInPoly(placemarkToCheck['coordinates'], user);

	}

	var rectangleLength = placemarkToCheck.rectangle.length;
	var halfLength =parsefloat(rectangleWidth/2);
	//for longitude check it with length
	var rectangleWidth = placemarkToCheck.rectangle.width;
	var halfWidth = parsefloat(rectangleWidth/2);
	//for latitude check it with width

	if (user.latitude < placemarkToCheck.latitude + halfLength){

    	if(user.latitude >= placemarkToCheck.latitude - halfLength){

			if(user.longitude >= placemarkToCheck.longitude - halfWidth){

	    		if(user.longitude < placemarkLongitude + halfWidth ){

	    			flag = true;

	    		}

			}

    	}


	}

	return flag;

}


// When the DOM of the parent document is fully complete, jquery runs this function. This runs before init().
$(document).ready(function(){

    // Load KML (and extract allCoordinatesArray from it)
    // window.url = gup('url');
    // window.allCoordinatesArray = parseNewKML(window.url);

    url = "/flask/assets/map.kml";
    //allCoordinatesArray = parseNewKML(window.url);
    parseNewKML(url);

    //Does parseNewKML return a value??

}); // einde van de compare ready function van jquery.
