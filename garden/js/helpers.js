// HELPER FUNCTIONS



// GEO

function geo_success(position)
	{
	alert("geo-succes: the GPS just gave good data!");
	//start_stop_btn.innerHTML="Stop"; // Set the label on the start/stop button to "Stop"
	
	//info_string="";
	
	var d=new Date(); // Date object, used below for output messahe
	var h=d.getHours();
	var m=d.getMinutes();
	var s=d.getSeconds();
		
	var current_datetime=format_time_component(h)+":"+format_time_component(m)+":"+format_time_component(s);
	
	
	// Check that the accuracy of our Geo location is sufficient for our needs
	if (position.coords.accuracy<=min_accuracy)
		{
		// We don't want to action anything if our position hasn't changed - we need this because on IPhone Safari at least, we get repeated readings of the same location with 
		// different accuracy which seems to count as a different reading - maybe it's just a very slightly different reading or maybe altitude, accuracy etc has changed
		if(prev_lat!=position.coords.latitude || prev_long!=position.coords.longitude)
			{
			if(position.coords.speed>max_speed)
				{
				max_speed=position.coords.speed;
				}
			else if(position.coords.speed<min_speed)
				{
				min_speed=position.coords.speed;
				}
				
			if(position.coords.altitude>max_altitude)
				{
				max_altitude=position.coords.altitude;
				}
			else if(position.coords.altitude<min_altitude)
				{
				min_altitude=position.coords.altitude;
				}
			
			
			prev_lat=position.coords.latitude;
			prev_long=position.coords.longitude;
			
			window.currentUserCoordinates.x = position.coords.longitude;
			window.currentUserCoordinates.y = position.coords.latitude;

			alert("Geo-succes: User coordinates changed, will now start placemark comparison");
			compare();
			//info_string="Current positon: lat="+position.coords.latitude+", long="+position.coords.longitude+" (accuracy "+Math.round(position.coords.accuracy, 1)+"m)<br />Speed: min="+(min_speed?min_speed:"Not recorded/0")+"m/s, max="+(max_speed?max_speed:"Not recorded/0")+"m/s<br />Altitude: min="+(min_altitude?min_altitude:"Not recorded/0")+"m, max="+(max_altitude?max_altitude:"Not recorded/0")+"m (accuracy "+Math.round(position.coords.altitudeAccuracy,1)+"m)<br />last reading taken at: "+current_datetime;
			}
		}
	else
		{
		display("GPS Warming Up"," ("+Math.round(position.coords.accuracy, 1)+"m vs "+min_accuracy+"m) - last reading taken at: "+current_datetime);
		}
	//if(info_string)
	//	op.innerHTML=info_string;
	}


function geo_error(error)
	{
	alert(dump(error));
	switch(error.code)
		{
		case error.TIMEOUT:
			{
			display("Timeout!","Probably no satelite lock..");
			}
		break;
		}
	}




// TIME FORMATTER

// This function just adds a leading "0" to time/date components which are <10 (because there is no cross-browser way I know of to do this using the date object)
function format_time_component(time_component)
	{
	if (time_component<10)
		{
		time_component="0"+time_component;
		}
	else if(time_component.length<2)
		{
		time_component=time_component+"0";
		}
	return time_component;
	}







// load xml
/*
function loadXMLDoc(url)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",url,false);
xhttp.send();
return xhttp.responseXML;
}
*/






// Better debugging, routes alert output to textarea instead of pop-up.
alert = function(s) 
	{ 
	var ta = document.getElementById('debugOutput');
	if (!ta) 
		{
		var ta = document.createElement('textarea');
		ta.id = 'debugOutput';
		ta.rows = 25; ta.cols = 80;
		document.body.appendChild(ta);
		}
	//ta.value += s+'\n';
	ta.value = s+'\n'+ta.value+'\n';
	}


	
// Debugging functions. REMOVE FROM PRDUCTION VERSION

// Dump an array to screen, like print_r.
/**
* Function : dump()
* Arguments: The data - array,hash(associative array),object
*    The level - OPTIONAL
* Returns  : The textual representation of the array.
* This function was inspired by the print_r function of PHP.
* This will accept some data as the argument and return a
* text that will be a more readable version of the
* array/hash/object that is given.
*/
function dump(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "    ";

if(typeof(arr) == 'object') { //Array/Hashes/Objects
 for(var item in arr) {
  var value = arr[item];
 
  if(typeof(value) == 'object') { //If it is an array,
   dumped_text += level_padding + "'" + item + "' ...\n";
   dumped_text += dump(value,level+1);
  } else {
   dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
  }
 }
} else { //Stings/Chars/Numbers etc.
 dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
} 




