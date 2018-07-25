//Boyan Peychoff 2016

//here's how reflect.js works

/*

it uses mapper.js to find nearby placemarks.

it find the nearby placemarks and then loads the sounds associated with that location.

reflect.js is polling every once in a while to check if new Placemarks are now nearby or
the old placemarks are no longer nearby.


Each placemark that is nearby  gets turned into an object.
the object ends up looking something like this:

 {"name":"PlaceMarkName",
 "sounds":["tracklist.mp3","path/to/soundfile.mp3"],
 "audioContext":referencetoPlacemarksUniqueAudioContext,
 "gainNode": referencetoGainNode,
 "rectangle":{"width":0.003,"length":"0.005"}

 each sound/track will also get their description from an xml file
 then the info from the xml file gets put into html.


}



*/



//CONTANTS
var DEFAULT_NARRATION_PATH = 'https://islamicgarden.ualberta.ca/flask/assets/defaultNarration.ogg';

var zones_visited = [];





function unSoloTrack(currentAudio, allAudio ,mutedList, soloedList ){

		//currentAudio['soloed'] = false;

	    //If there are other soloed tracks

	    var falseSoloedCheck = false;

	    if ( soloedList.length > 0 ){

	    	//keep the volume at 0 since other tracks are soloed
	    	for(var i = 0; i < soloedList.length;i++){

	    		if(currentAudio==soloedList[i]){

	    			falseSoloedCheck = true;

	    		}
	    	}



	    	if (falseSoloedCheck === true){

	    		if(soloedList.length === 1){

	    			currentAudio.volume=1;

		    	 	for(var j = 0 ; j < allAudio.length; j++){

		    	 		allAudio[j].volume = 1 ;

		    	 		if( mutedList.length > 0 ){

			    	 		for(var k = 0; k < mutedList.length; k++){


			    	 			if ( allAudio[j] == mutedList[k] ){

			    	 				allAudio[j].volume = 0 ;


			    	 			}

			    	 		} //k for loop

		    	 		}

		    	 	}//j for loop


	    		}


	    	} // falseSoloedCheck
	    }

	    else{

	    	if(currentAudio['muted']!== true){

	    		currentAudio.volume = 1;


	    	}



    	 	for(var j = 0 ; j < allAudio.length; j++){

    	 		allAudio[j].volume = 1 ;

    	 		if( mutedList.length > 0 ){

	    	 		for(var k = 0; k < mutedList.length; k++){


	    	 			if ( allAudio[j] == mutedList[k] ){

	    	 				allAudio[j].volume = 0 ;


	    	 			}

	    	 		}

    	 		}

    	 	}


	} // end else


	for(var i = 0; i < soloedList.length; i++){

		if(currentAudio !== soloedList[i]){


			currentAudio.volume=0;


		}



	}



}



function soloTrack( currentAudio, allAudio, soloedList){

	//solo track seems to work

	//console.log("currently soloing track");


	//currentAudio['soloed'] = true;


	for(var i = 0; i < allAudio.length; i++ ){

		//it doesn't matter if it's muted or not everything else gets turned down.


		allAudio[i].volume = 0;



		if ( soloedList.length > 0  ){

			for(var k = 0; k < soloedList.length; k++){


				if(allAudio[i] == soloedList[k]){


					allAudio[i].volume = 1;


				}




			}


		}


	}

	currentAudio.volume = 1;




}


//This is used to determine the properties of the track based on the track type in map.KML.


function trackDecorator(zone_type, audioElement){





		if(zone_type == 'triggered' || zone_type == 'ambient'){


				audioElement.loop = true;


		}

		if(zone_type == 'zone'){

			//Zone audio should only place once for the user.
			audioElement['hasplayed'] = true;


			//TODO
			audioElement['defaultSource'] = DEFAULT_NARRATION_PATH;
			zones_visted.push(audioElement['placemarkName']);


		}






}

//CONSTANTS
var ZONE_COLOR_CONSTANTS = ['#83fcbd','#a8abed', '#ff8989' , 'purple' , 'green', 'yellow'];

var ZONE_AMOUNT = 6;





function initializeSounds(placemark , audioQueue){

	var soundsEndpoint = "https://islamicgarden.ualberta.ca/flask/api/sounds?placemarkName=";
	console.log(soundsEndpoint+placemark.name);
	var audioList = [];
	$.getJSON(soundsEndpoint+placemark.name,function(data){

		audioList = [];
			for(var i = 1; i < data.length;i++){


				audioList.push(data[i]);
				//console.log("GETTING DATA FROM SOUNDS ENDPOINT");
				//console.log(data[i]);

			}


	}).then(function(){


		var placemarkAudioElements = document.getElementsByClassName("audio-"+placemark.name);
		var audioElement;

		for(var i = 0 ; i < audioList.length; i++){
			//console.log("INSIDE INIT TRACK");
			//console.log(audioList[i]);


			audioElement = audioQueue.pop();
			console.log("popped audio element: ");
			console.log(audioElement);
			audioElement.className = 'audio-'+placemark.name;
			var placemarkTag = audioElement.parentElement.getElementsByClassName('placemarkTag')[0];
			placemarkTag.innerHTML = placemark.name;
			var oneLineDesc_Holder = audioElement.parentElement.getElementsByClassName('oneLineDescription')[0];
			oneLineDesc_Holder.innerHTML = audioList[i]['one_line_desc'];
			var learnMoreButton = audioElement.parentElement.getElementsByClassName("infobutton")[0];
			learnMoreButton['track_id'] = audioList[i]["track_id"];
			learnMoreButton.id = "infoButton" + audioList[i]["track_id"];
			var sourceForTrack = audioElement.getElementsByTagName("SOURCE")[0];
			//if the track is not of a zone, don't try to sync all users tracks together.



			if(placemark.name.indexOf(/zone+/g) < 0){




		 		audioElement.addEventListener("loadedmetadata",  loadedMetaDataHandler	);


			}
		 	/*placemarkAudioElements[i].addEventListener("ended", function(){
		 		console.log("I don't think I come here ever.... ENDED");

		 		this.removeEventListener('canplaythrough',canPlayThroughHandler);
		 		this.loop=true;
		 		this.play();

		 	});*/

			audioElement.pause();
			if(audioElement['gainNode'].gain.value < 1){

				audioElement['gainNode'].gain.value=1;

			}

			sourceForTrack.src = audioList[i]['path'];
			audioElement.load();

			audioElement.play();
			//placemarkAudioElements[i].removeEventListener(('canplaythrough',canPlayThroughHandler));
			var gainDisplay = document.createElement('P');
			gainDisplay.className = 'gainDisplay';
			gainDisplay.innerHTML='gain.value : ' + audioElement['gainNode'].gain.value;
			audioElement.parentNode.appendChild(gainDisplay);

			audioElement.parentNode.style.display='block';
			audioElement.parentNode.style.visibility = "visible";

		}


	});//finish the then from getJSON


}


var oldPlacemarks = [];
var audioPlayerQueue = [];

$(window).load(function(){


//var controller = new audioController();

var clickCheck = false;

var oldPlacemarkCounter = 0;

var startFlag = false;



var mapperCheck = setInterval(function(){

	if(nearbyPlacemarks.length > 0){
		console.log("YO");

	    for (var i = 0; i < nearbyPlacemarks.length;i++){

	    	oldPlacemarks[i] = nearbyPlacemarks[i];

	    }
	    clearInterval(mapperCheck);
	    startFlag=true;
	    start();



	}


	},1000);



setInterval(function(){

    if (startFlag){

		if(oldPlacemarks){
			updatePlacemarks(oldPlacemarks,audioPlayerQueue);

		}


    }


},2000);


setInterval(function(){


	if(startFlag){
		gainChangeDueToDistance();

	}

},1000);

function start(){



    var startButton = document.createElement("BUTTON");

    startButton.className = "startButton";
    startButton.innerHTML = "START";
	var startDiv = $(".start")[0];
	//console.log(startDiv);
	startDiv.innerHTML = '';
	startDiv.appendChild(startButton);
	startButton.addEventListener("click",function(){

		initializePage(audioPlayerQueue);
		var allAudio = $("AUDIO");
		for(i = 0 ; i < allAudio.length ; i++){

			allAudio[i].play();

		}


		this.parentNode.removeChild(this);
		//remove start div. It's not longer required
		startDiv.style.display='none';

	});


};




function gainChangeDueToDistance(){

	function degreesToRadians(degrees) {
	  return degrees * Math.PI / 180;
	}

	//from https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
	function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
	  var earthRadiusKm = 6371;

	  var dLat = degreesToRadians(lat2-lat1);
	  var dLon = degreesToRadians(lon2-lon1);

	  lat1 = degreesToRadians(lat1);
	  lat2 = degreesToRadians(lat2);

	  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	  return earthRadiusKm * c;
	}

    for(var i = 0 ; i < nearbyPlacemarks.length;i++){


		if(nearbyPlacemarks[i].name !=="Ambient"){



			var boundaryLatitude = nearbyPlacemarks[i].latitude + Number(defaultBoundary.width);
			var boundaryLongitude = nearbyPlacemarks[i].longitude + Number(defaultBoundary.length);

	    	var distanceBetweenPlacemarkCenterAndUser = distanceInKmBetweenEarthCoordinates(nearbyPlacemarks[i].latitude, nearbyPlacemarks[i].longitude, user.latitude, user.longitude);
	    	var distanceBetweenPlacemarkCenterAndBoundary = distanceInKmBetweenEarthCoordinates(nearbyPlacemarks[i].latitude, nearbyPlacemarks[i].longitude,boundaryLatitude , boundaryLongitude );



		    var newGainValue = 0 ;

				var tempValue = 1 - (distanceBetweenPlacemarkCenterAndUser/distanceBetweenPlacemarkCenterAndBoundary);

				var defaultNearbyGain = 1;

		    newGainValue = tempValue > 0 ? tempValue :defaultNearbyGain ;

		   	//console.log("newGainValue: " + newGainValue);
		   	//console.log(nearbyPlacemarks[i]);
		   	try{

		   		var placemarkName = nearbyPlacemarks[i].name;
		   		var placemarkAudioElements = document.getElementsByClassName('audio-'+placemarkName);
		   		for(var j = 0; j < placemarkAudioElements.length; j++){

		   			var distanceDisplay = placemarkAudioElements[j].parentElement.getElementsByClassName('distanceDisplay')[0];
		   			distanceDisplay.innerHTML='distance in metres between user and placemark : ' + (distanceBetweenPlacemarkCenterAndUser * 1000).toFixed(5);
			    	placemarkAudioElements[j]['gainNode'].gain.value = newGainValue;
			    	var gainDisplay = placemarkAudioElements[j].parentElement.getElementsByClassName('gainDisplay')[0];
			    	gainDisplay.innerHTML = 'gain value: ' + newGainValue.toFixed(5);


		   		}


		   	}
		   	catch(e){
		   		//wait until the placemarks get their audio context
		   		console.log("GAIN CHANGE ERROR" + placemarkName);
		   		console.log(e);
					//Sometimes newGainValue gives NaN (not a number) when a user is too close so set to 1 (full volume).
					placemarkAudioElements[j]['gainNode'].gain.value = 1;
					//ehh i put it outside of the error thing because gainChangeDueToDistance gets called a lot so it doesnt help to set it to 0.25 in the error when it just gets reset again.

		   	}


		}
    }


}





function audioTrackCleanup(){

	//remove all audio

    var audioWraps = $(".audioWrap");

    for(var i = 0 ; i < audioWraps.length; i++){

        while(audioWraps[i].firstChild){

            audioWraps[i].removeChild(audioWraps[i].firstChild);
        }


    }






}


function updatePlacemarks(oldPlacemarks,audioPlayerQueue){

	var newPlacemarksCounter= new Array(nearbyPlacemarks.length).fill(0);;
	if(nearbyPlacemarks.length > 0 ){

		//from mapper.js
		for(var i =  0 ; i < oldPlacemarks.length;i++){

			var stillNear=false;
			for(var j = 0; j < nearbyPlacemarks.length;j++){

			    if(oldPlacemarks[i].name==nearbyPlacemarks[j].name){

					stillNear=true;
					break;


			    }

			    else{

					newPlacemarksCounter[j]++;

					if(newPlacemarksCounter[j]==oldPlacemarks.length){
						//console.log(nearbyPlacemarks[j].name);
						//initializeSounds(nearbyPlacemarks[j]);

					}
			    }


			}
			//console.log(newPlacemarksCounter[j]);
			//console.log(stillNear);
			if(!stillNear){
			    var old = oldPlacemarks.splice(i,1);
			    console.log("placemark no longer near");
			    console.log(old);

			    removeAudioForPlacemark(old[0],audioPlayerQueue);


			}


		} // end of oldPlacemarks loop

		for(var i =  0 ; i < nearbyPlacemarks.length;i++){
			var newPlacemark = true;
			for(var j = 0; j < oldPlacemarks.length;j++){


			    if(oldPlacemarks[j].name==nearbyPlacemarks[i].name){

					newPlacemark=false;
					break;


			    }

			  //   else{
			  //   	console.log("I should be coming here sometimes.....");
					// newPlacemarksCounter[j]++;
					// console.log(nearbyPlacemarks[j].name);
					// console.log(newPlacemarksCounter);
					// if(newPlacemarksCounter[j]==oldPlacemarks.length){
					// 	console.log(nearbyPlacemarks[j].name);
					// 	initializeSounds(nearbyPlacemarks[j]);

					// }
			    }


			if(newPlacemark){

			    oldPlacemarks.push(nearbyPlacemarks[i]);
			    if(audioPlayerQueue.length > 0){

			    	initializeSounds(nearbyPlacemarks[i],audioPlayerQueue);


			    }
			   else{

			   	throw "NO AUDIO HTML ELEMENTS ARE AVAILABLE>>>>>";


			   }


			}


		} // end of oldPlacemarks loop

	}

}



function removeAudioForPlacemark(farPlacemark, audioQueue){


	//console.log("do i ever remove audio?");
	var divWrappers = document.getElementsByClassName("audioWrap");
	var farPlacemarkAudio = document.getElementsByClassName("audio-"+farPlacemark.name);
	//console.log(farPlacemarkAudio);
	//audioCtx is the same for all audio
	//var audioCtx = farPlacemarkAudio[0]['audioContext'];

	//CHECK IF TRACKS BEING REMOVED ARE SOLOED.
	for(var k= 0; k < farPlacemarkAudio.length; k++){


		var sourceForTrack = farPlacemarkAudio[k].getElementsByTagName("SOURCE")[0];
		//console.log('Am I removing audio the way i Should BE?? ------------------------------------------------------------------------------------------------------------------------');

		resetAudioElement(farPlacemarkAudio[k],audioQueue);

		//wait for track to fadeout then reset it
		//setTimeout(,3200);

	} // For loop farPlacemarkAudio


}


});

function loadedMetaDataHandler(event){

	var htmlAudio = event.target;

	console.log('checkingCanplaythrough listener');
	//console.log(htmlAudio.duration);
	//console.log(htmlAudio);
	var timeToStart =  findTrackStartTime(htmlAudio.duration);
	//console.log('timeToStart: '+timeToStart);

	//because in most browsers setting currentTime forces canplaythrough event again.
	if(this.currentTime < timeToStart){

		this.currentTime = timeToStart;


	}




};


//this function is used to find the time for the tracks so
//that each user can have the tracks play in roughly the same area
//of the track.
function findTrackStartTime(trackDuration){
	//track duration should be in seconds

	//get current time in seconds
	var currentTime = new Date().getTime() / 1000;
	//console.log("currentTime: " + currentTime);
	//console.log("trackDuration: "+ trackDuration);
	var trackStartTime = currentTime % trackDuration;
	//console.log("trackStartTime" + trackStartTime);
	return trackStartTime;




};

function initializePage(audioPlayerQueue){

  var map;
  var userLocation;


 var putUserOnMap = function (position){

 	var pos = position;


 	if(!userLocation){

		userLocation = new google.maps.Marker({

			position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
			map:map,
			icon:{
				//TODO check if this works
				url:'https://maps.gstatic.com/tactile/minimap/pegman-offscreen-1x.png',
				scaledSize:new google.maps.Size(100,100)},
			shape:'circle',
			fillColor:'blue',
			fillOpacity:.6,
			radius:1.5,
			zIndex: 500,
			draggable:false,





		});


 	}
 	else{


 		userLocation.setPosition(
 			new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
 				);


 	}




 };


var locError = function (error){

	alert('error watching position....');
	console.log(error);




};



var createZoneSquare = function (ZoneCoords){

	//first and last set of coords need to be the same to complete the drawing of the polygon.
	var distance_from_center = 0.00015;
	var zoneSquareCoords = [


		{lat:parseFloat(ZoneCoords[0]) - distance_from_center , lng:parseFloat(ZoneCoords[1]) - distance_from_center},
		{lat: parseFloat(ZoneCoords[0]) + distance_from_center, lng: parseFloat(ZoneCoords[1]) - distance_from_center },
		{lat: parseFloat(ZoneCoords[0]) + distance_from_center, lng: parseFloat(ZoneCoords[1]) + distance_from_center },
		{lat: parseFloat(ZoneCoords[0]) - distance_from_center, lng: parseFloat(ZoneCoords[1]) + distance_from_center },
		{lat: parseFloat(ZoneCoords[0]) - distance_from_center, lng: parseFloat(ZoneCoords[1]) - distance_from_center }


	];

	console.log(zoneSquareCoords);

	return zoneSquareCoords;
}


var drawZoneOnMap = function(map, ZoneCoords){

//ZoneCoords should be an array with the Zones coordinates.


for(var i =0 ; i < ZoneCoords.length; i++){
	var squareForZone = createZoneSquare(ZoneCoords[i]);
	var ZoneSquare = new google.maps.Polygon({
          paths: squareForZone,
          strokeColor: ZONE_COLOR_CONSTANTS[i],
          strokeOpacity: 0.4,
          strokeWeight: 2,
          fillColor: ZONE_COLOR_CONSTANTS[i],
          fillOpacity: 0.35
        });
    ZoneSquare.setMap(map);



}





};





 var populateMap = function(){

 	if (navigator.geolocation) {
                navigator.geolocation.watchPosition(putUserOnMap, locError);

	 	var allPlacemarks = farAwayPlacemarks.concat(nearbyPlacemarks);
	 	//console.log(allPlacemarks);
	 	map = new google.maps.Map(document.getElementById('map'), {

	 		zoom:18,
	 		center: new google.maps.LatLng(53.526736,-113.521747),
	 		mapTypeId: 'terrain'

	 	});

	 	for (var i = 0 ; i < allPlacemarks.length; i++){

	 		//TODO decide how we're gonna show placemarks if they are more than 1 coordinate.
	 		console.log(allPlacemarks[i].name + ": " + allPlacemarks[i].coordinates[0][0] + ", " +  allPlacemarks[i].coordinates[0][1]);
			var latLng = new google.maps.LatLng(allPlacemarks[i].coordinates[0][0],allPlacemarks[i].coordinates[0][1]);
			var marker = new google.maps.Marker({
				position: latLng,
				map: map
			});



	 	}
	}
 	else{

 		alert("we can't find your location!");

 	}

	for(var i = 0 ; Zones.length; i++){



		//drawZoneOnMap(map,createZoneSquare(Zones[i].coordinateArray));


	}

	//putUserOnMap(currentUserCoordinates);

 };

//populateMap();





 var makeMapLegend = function (){



 	var mapLegend = document.getElementById("map-legend");

 	var zoneList = document.createElement('UL');
 	zoneList.className = "list-columns";

 	var zoneColorList = document.createElement('UL');
 	zoneColorList.className = "list-columns";



 	for(var i = 0; i < ZONE_AMOUNT; i++){

 		var listItem = document.createElement('LI');

 		listItem.className = "zonelist";
 		listItem.innerHTML = 'Zone ' + (i+1);

 		var colorItem = document.createElement('LI');

 		colorItem.className = 'zone-colors';
 		colorItem.style.backgroundColor = ZONE_COLOR_CONSTANTS[i];

 		zoneList.appendChild(listItem);
 		zoneColorList.appendChild(colorItem);


 	}

 	mapLegend.appendChild(zoneList);
 	mapLegend.appendChild(zoneColorList);


 };
 makeMapLegend();

var audioContext;

	try{

	    window.AudioContext=window.AudioContext||window.webkitAudioContext;

	    audioContext = new AudioContext();

	}

	catch(e){


		alert("error: " + e);


	}

 	var MAX_AUDIO_TRACKS = 8;


	var analyser = audioContext.createAnalyser();
	;



    var audioList = [];

    var body = $("body")[0];



    var locationAudioHolder = document.createElement("DIV");
    var locationNameHeader = document.createElement("H4");
    locationNameHeader.innerHTML = 'Audio tracks';
    locationAudioHolder.appendChild(locationNameHeader);
    locationAudioHolder.className = "locationAudioHolder";
    locationAudioHolder.style.display='-inline-block';
    locationAudioHolder.style.visibility='visible';

    //max_audio could probably be lower
    //I think if its higher like 5 or 6 the mobile browsers are more likely to crash







    for(var k = 0; k < MAX_AUDIO_TRACKS ; k++ ){

    console.log("INSIDE AUDIO ELEMENT MAKER LOOP");




	    var divWrap = document.createElement("DIV");
	    var placemarkTag = document.createElement('SPAN');
	    placemarkTag.className= 'placemarkTag';
	    placemarkTag.innerHTML = '';
	    divWrap.appendChild(placemarkTag);

	    var oneLineDescription = document.createElement('P');
	    oneLineDescription.className = 'oneLineDescription';
	    oneLineDescription.innerHTML = '';
	    divWrap.appendChild(oneLineDescription);



	    divWrap.id = k ;
	    var soloButton = document.createElement("BUTTON");
	    soloButton.id= k ;
	    soloButton.innerHTML = "S";
	    soloButton.className="soloButton";
	    soloButton.style.color="white";
	    divWrap.appendChild(soloButton);
	    var muteButton = document.createElement("BUTTON");
	    muteButton.id= k ;
	    muteButton.innerHTML = "M"
	    muteButton.className="muteButton";
	    muteButton.style.color="white !important";
	    divWrap.appendChild(muteButton);

	    var narrationButton = document.createElement("BUTTON");
	    narrationButton.id = k;
	    narrationButton.innerHTML = 'Narration';
	    narrationButton.className='narrationButton';
	    narrationButton.style.color='white';
	    divWrap.appendChild(narrationButton);


	    divWrap.className= "audioWrap";
	    //divWrap["placemark"]=placemarkName;
	    divWrap.style.display='none';
	    divWrap.style.visibility='hidden';
	    var audio = document.createElement("AUDIO");
	    //the soloed attribute is used to check if a track is being soloed
	    audio['soloed']=false;
	    audio['muted']=false;
	    audio.loop = true;

	    //autoplay doesn't work on mobile browsers usually.
	   // audio.autoplay = true;
	    audio.controls = true;
	    audio.preload = "auto";
	    //wait for webAudio
	    audio.id='audio-'+k;
			var classNameSuffix = divWrap['placemark']? divWrap['placemark']:'0';
	    audio.className = "audio-"+divWrap['placemark'];
	    //audio.id = audioList[k]['track_id'];
	    var source = document.createElement("SOURCE");
	    //we leave it blank until the user gets to that placemark.
	    source.src ="assets/silence.mp3";
	    audio.appendChild(source);

	    //add to queue
	    audioPlayerQueue.push(audio);




	    var learnMoreButton = document.createElement("BUTTON");
	    learnMoreButton.className = "infoButton";
	    learnMoreButton.innerHTML = "track info";
	    //learnMoreButton['track_id'] = audioList[k]['track_id'];
	    //learnMoreButton.id = "infoButton"+learnMoreButton["track_id"];
	    divWrap.appendChild(learnMoreButton);

	    audio['audioContext'] = audioContext;

	    var webAudioSource = audioContext.createMediaElementSource(audio);
	    var gainNode = audioContext.createGain();

	    webAudioSource.connect(gainNode);
	    //analyser.connect(audioContext.destination);


	    gainNode.connect(audioContext.destination);

	    audio['gainNode'] = gainNode;
	    divWrap.appendChild(audio);

		//instead of global reference to all gainNodes and audioContext
		//i just make it an attribute for the placemarkObjects
	   // audioContextList.push(audioContext);
	   // gainNodeList.push(gainNode);

		locationAudioHolder.appendChild(divWrap);


		var distanceToPlacemarkDisplay = document.createElement("p");
		distanceToPlacemarkDisplay.className = 'distanceDisplay';
		divWrap.appendChild(distanceToPlacemarkDisplay);


		learnMoreButton.addEventListener('click',function(event){

			var audioID = this.parentNode.id;

			if(typeof(this["showInfo"]) === "undefined" || this["showInfo"] === false){

				this["showInfo"] = true;
				this.innerHTML="hide Info";
				var baseURL = 'https://islamicgarden.ualberta.ca/flask';
				var descriptionEndpoint = '/api/descriptions?track_id=';
				var track_id = this['track_id'];
				var descObj= {};
				$.getJSON(baseURL + descriptionEndpoint + parseInt(track_id),function(data){


					descObj["text_desc"] = data[0]['text_desc'];

					//this gives just a url to the text file
					descObj["inst_desc"] = data[0]["inst_desc"];
					alert(descObj['inst_desc']);

				}).then(function(){


					var thisButton  = document.getElementById("infoButton"+track_id);

					var infoWrapper = document.createElement("DIV");
					infoWrapper.className = "infoWrapper";
					//console.log("LEARN MORE BUTTON CLICK");
				    var textDesc = document.createElement("P");
				    //console.log(textDesc);
			    	textDesc.innerHTML = descObj['text_desc'];
			    	textDesc.className = "learnMore"+audioID + " infoDesc";
			    	var instrumentDesc = document.createElement("P");
			    	//console.log(instrumentDesc);
			    	if(descObj['inst_desc']){


				    	instrumentDesc.innerHTML = getDescriptionFromTextFile(descObj['inst_desc']);
				    	instrumentDesc.className = 'learnMore'+audioID + " instDesc";
				    	infoWrapper.appendChild(instrumentDesc);

			    	}

			    	var imgsForTrack = [];

			    	//this is a dummy src
			    	//imgForTrack.className = "learnMore"+audioID + " trackImg ";


			    	var picEndPoint = '/api/pictures?track_id=';
			    	$.getJSON(baseURL + picEndPoint + + parseInt(track_id), function(data){

			    		for(var i = 0; i < data.length; i++){

			    		imgsForTrack += data[i]['pics'];


			    		}

			    	});

			    	infoWrapper.appendChild(textDesc);


			    	for (var index = 0 ; index < imgsForTrack.length; i++){

			    		var imageToAppend = imgsForTrack[index];

			    		var imgElement = document.createElement("IMG");
			    		var imgDescriptionHolder = document.createElement('DIV');

			    		imgElement.src = imgsForTrack[index][0];
			    		imgDescriptionHolder.innerHTML = imgsForTrack[index][1];

			    		infoWrapper.appendChild(imgElement);
			    		infoWrapper.appendChild(imgDescriptionHolder);


			    	}



					thisButton.parentNode.appendChild(infoWrapper);


					//parentDiv.appendChild(videoForTrack);





				});




			}

			else{

				this["showInfo"] = false;
				this.innerHTML="track info";
				//remove all info when hidden
				$(".learnMore"+audioID).remove();

				//TODO
				var infowrapToRemove = this.parentNode.getElementsByClassName("infoWrapper")[0];
				this.parentNode.removeChild(infowrapToRemove);



			}



		});


	    muteButton.addEventListener("click", function(event){

	    var currentAudio = this.parentNode.getElementsByTagName("audio")[0];
	    var allAudio = document.getElementsByTagName('audio');

	    //console.log("MUTE BUTTON CLICKED");

	    if(currentAudio['muted']===false || currentAudio['muted']==undefined){

	    	currentAudio["muted"] = true;
		    currentAudio.volume = 0;
		    this.style["background-color"]="red";

	    }
	    else{


	    	currentAudio["muted"] = false;
			var soloCheck = false
	    	for(var i=0; i < allAudio.length;i++){

	    		if(allAudio[i]["soloed"]===true){


	    			currentAudio.volume = 0;
	    			soloCheck = true;
	    		}

	    	}

		if(soloCheck === false){

		    currentAudio.volume = 1;

		}

		if(currentAudio["soloed"] == true){


			currentAudio.volume = 1;

		}
		    //currentAudio.volume = 1;

		    this.style["background-color"]="black";
	    }

	    });


	    soloButton.addEventListener("click", function(event){

	   	var buttonID = this.id;
		var currentAudio = this.parentNode.getElementsByTagName("audio")[0];

	    var allAudio = document.getElementsByTagName('audio');
	    //console.log("________________________allAudio______________________________________");
	   	//console.log(allAudio);
	    var soloedtrack;

	    var soloedList = [];
	    var mutedList = [];

	    for(var index = 0; index < allAudio.length; index++){



	    	//find other soloed tracks
	    	if (allAudio[index]['soloed'] === true ){


	    		soloedList.push(allAudio[index]);

	    	}

	    	//find all muted tracks
	    	if(allAudio[index]['muted'] === true){


	    		mutedList.push(allAudio[index]);


	    	}



	    }


	    if(currentAudio['soloed']===true){

	    	//WHEN A SOUND IS BEING UN-SOLOED
	    	currentAudio['soloed'] = false;
	    	this.style["background-color"]="black";

			unSoloTrack( currentAudio ,allAudio , mutedList , soloedList );



	    }

	    else{

	    	//WHEN A SOUND IS BEING SOLOED
	    	currentAudio['soloed']=true;
			this.style["background-color"]="red";

	    	soloTrack( currentAudio, allAudio , soloedList);



	    }




	    });

	    narrationButton.addEventListener("click", function(){

	    	 var currentAudio = this.parentNode.getElementsByTagName("audio")[0];
	    	 var sourceForTrack = currentAudio.getElementsByTagName("SOURCE")[0];
	    	 currentAudio.pause();

	    	 if (currentAudio.includes(DEFAULT_NARRATION_PATH)){

	    	 	var zoneNumber = currentAudio["placemarkName"].match(/\d+/g);



				sourceForTrack.src = 'assets/zone' + zoneNumber+ '.ogg';
				currentAudio.load();
				currentAudio['gainNode'].gain.exponentialRampToValueAtTime(1.0, currentAudio.audioContext.currentTime + 1);
				currentAudio.play();


	    	 }
	    	 else{

	    	 	sourceForTrack.src=DEFAULT_NARRATION_PATH;
				currentAudio.load();
				currentAudio['gainNode'].gain.exponentialRampToValueAtTime(1.0, currentAudio.audioContext.currentTime + 1);
				currentAudio.play();


	    	 }




	    });


	    body.appendChild(locationAudioHolder);

	    }


	//TODO - check if this doesn't ruin anything


	for (var ind = 0 ; ind < nearbyPlacemarks.length;ind++){

		initializeSounds(nearbyPlacemarks[ind],audioPlayerQueue);



	}




}


function getDescriptionFromTextFile(textFileURL){


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
	        return xmlhttp.responseText;
	    }
	}
	xmlhttp.open("GET", textFileURL, false );
	xmlhttp.send();

	var description = xmlhttp.responseText;

	console.log('DESCRIPTION IS:---------------- ' + textFileURL);

	console.log(description);


	return description;






};




function SoloCheckUnSolo(audioElement){


	if (audioElement['soloed']==true){

		var soloButton = audioElement.parentNode.getElementsByClassName('soloButton')[0];
		audioElement['soloed'] = false;
		soloButton.style["background-color"]="black";

		var allAudio = document.getElementsByTagName('AUDIO');
		var soloedList = [];
		var mutedList=[];

		for(var index = 0; index < allAudio.length; index++){

			//find other soloed tracks
			if (allAudio[index]['soloed'] === true ){


				soloedList.push(allAudio[index]);

			}

			//find all muted tracks
			if(allAudio[index]['muted'] === true){


				mutedList.push(allAudio[index]);


			}

		}

		unSoloTrack(audioElement, allAudio , mutedList , soloedList );

	}





}

function resetAudioElement(audioElement, audioQueue){


	var sourceForTrack = audioElement.getElementsByTagName("SOURCE")[0];


	audioElement['gainNode'].gain.exponentialRampToValueAtTime(0.001, audioElement.audioContext.currentTime + 1);

	audioElement.pause();
	sourceForTrack.src = 'assets/silence.mp3';
	audioElement.load();
	audioElement['gainNode'].gain.exponentialRampToValueAtTime(1.0, audioElement.audioContext.currentTime + 1);
	audioElement.play();
	//put back the silent audio elements to be used again later.

	//this is used for debugging only
	var gainDisplay = audioElement.parentElement.getElementsByClassName('gainDisplay')[0];
	audioElement.parentElement.removeChild(gainDisplay);


	audioElement.parentElement.style.visibility='hidden';
	audioElement.parentElement.style.display='none';

	SoloCheckUnSolo(audioElement);

	//put the silent audio back in the queue, so other locations can use it later.
	//gain needs to be reset first.
	audioQueue.push(audioElement);






}
