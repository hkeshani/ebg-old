function audioController() {

	var audioElemQueue = [];
	var zonesVisited = [];

	var audioContext =  undefined;

	var MAX_AUDIO_TRACKS = 12;

	var soloedList = [];
	var mutedList = [];


	var soloTrack = function(currentAudio, allAudio, soloedList){



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








	};


	var unSoloTrack = function(currentAudio, allAudio ,mutedList, soloedList){

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






		};




	this.createAudioElems= function(){







	};


	this.getAudioElem = function(){

		if(audioElemQueue.length > 0){

			return audioElemQueue.pop();

		}
		else{


			throw 'NO AUDIO ELEMENTS LEFT IN QUEUE.';


		}






	};



	this.resetAudioElem = function(audioElement){

		var sourceForTrack = audioElement.getElementsByTagName("SOURCE")[0];


		audioElement['gainNode'].gain.exponentialRampToValueAtTime(0.001, audioElement.audioContext.currentTime + 1);


		/*while(true){


			if(audioElement['gainNode'].gain.value < 0.1){

			audioElement.pause();
			sourceForTrack.src = 'assets/silence.mp3';
			audioElement.load();
			audioElement['gainNode'].gain.value = 1;
			audioElement.play();
			//put back the silent audio elements to be used again later.
			audioElement.parentElement.style.visibility='hidden';
			audioElement.parentElement.style.display='none';

			SoloCheckUnSolo(audioElement);

			//put the silent audio back in the queue, so other locations can use it later.
			//gain needs to be reset first.
			this.audioElemQueue.push(audioElement);

			break;
			}


		}*/





	};




	this.createAudioContext = function(){



		var audioContext;

		try{

		    window.AudioContext=window.AudioContext||window.webkitAudioContext;

		    audioContext = new AudioContext();

		}

		catch(e){


			alert("error: " + e);


		}

		this.audioContext = audioContext;
		return this.audioContext;


	};


	this.getAudioContext = function(){

		return this.audioContext || this.createAudioContext();


	};

	this.isZoneVisited = function(){







	};



	this.removeAudioForPlacemark = function(farPlacemark, audioQueue){


		//console.log("do i ever remove audio?");
		var divWrappers = document.getElementsByClassName("audioWrap");
		var farPlacemarkAudio = document.getElementsByClassName("audio-"+farPlacemark.name);
		//console.log(farPlacemarkAudio);
		//audioCtx is the same for all audio
		var audioCtx = farPlacemarkAudio[0]['audioContext'];

		//CHECK IF TRACKS BEING REMOVED ARE SOLOED.
		for(var k= 0; k < farPlacemarkAudio.length; k++){


			var sourceForTrack = farPlacemarkAudio[k].getElementsByTagName("SOURCE")[0];
			//console.log('Am I removing audio the way i Should BE?? ------------------------------------------------------------------------------------------------------------------------');

			resetAudioElement(farPlacemarkAudio[k],audioQueue);

			//wait for track to fadeout then reset it
			//setTimeout(,3200);

		} // For loop farPlacemarkAudio


	};



	this.initPage = function(){



 	var audioContext = this.getAudioContext();

	var analyser = audioContext.createAnalyser();



    var audioList = [];

    var body = $("body")[0];



    var locationAudioHolder = document.createElement("DIV");
    var locationNameHeader = document.createElement("H4");
    locationNameHeader.innerHTML = 'Audio tracks';
    locationAudioHolder.appendChild(locationNameHeader);
    locationAudioHolder.className = "locationAudioHolder";
    locationAudioHolder.style.display='block';
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
	    audio.className = "audio-"+divWrap['placemark'];
	    //audio.id = audioList[k]['track_id'];
	    var source = document.createElement("SOURCE");
	    //we leave it blank until the user gets to that placemark.
	    source.src ="assets/silence.mp3";
	    audio.appendChild(source);

	    //add to queue
	    audioElemQueue.push(audio);




	    var learnMoreButton = document.createElement("BUTTON");
	    learnMoreButton.className = "infoButton";
	    learnMoreButton.innerHTML = "track info";
	    //learnMoreButton['track_id'] = audioList[k]['track_id'];
	    //learnMoreButton.id = "infoButton"+learnMoreButton["track_id"];
	    divWrap.appendChild(learnMoreButton);


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


		learnMoreButton.addEventListener('click',function(event){

			var audioID = this.parentNode.id;

			if(typeof(this["showInfo"]) === "undefined" || this["showInfo"] === false){

				this["showInfo"] = true;
				this.innerHTML="hide Info";
				var descriptionEndpoint = 'https://islamicgarden.ualberta.ca/api.php?track_id=';
				var track_id = this['track_id'];
				var descObj= {};
				$.getJSON(descriptionEndpoint + parseInt(track_id),function(data){


					descObj["text_desc"] = data[0]['text_desc'];
					descObj["inst_desc"] = data[0]["inst_desc"];
					descObj["vid_path"] = data[0]["vid_path"];
					descObj["pic_path"] = data[0]["pic_path"];

					//console.log("GETTING DESCRIPTION for ID : " + track_id);
					//console.log(descObj);




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
			    	instrumentDesc.innerHTML = descObj['inst_desc'];
			    	instrumentDesc.className = 'learnMore'+audioID + " instDesc";
			    	var imgForTrack = document.createElement("IMG");

			    	//this is a dummy src
			    	imgForTrack.src= descObj['pic_path'];
			    	imgForTrack.className = "learnMore"+audioID + " trackImg ";

			    	/*var videoForTrack = document.createElement("VIDEO");
			    	var srcForVideo = document.createElement("SOURCE");
			    	srcForVideo.src='../assets/realPathHere.mp4';
					*/

					infoWrapper.appendChild(textDesc);
					infoWrapper.appendChild(instrumentDesc);
					infoWrapper.appendChild(imgForTrack);

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


	    body.appendChild(locationAudioHolder);

	    }


	//TODO - check if this doesn't ruin anything

	var allAudio = $("AUDIO");
	for(i = 0 ; i < allAudio.length ; i++){

		allAudio[i].play();

	}






	for (var ind = 0 ; ind < nearbyPlacemarks.length;ind++){

		this.initSounds(nearbyPlacemarks[ind], audioElemQueue);



	}










	};

	this.initSounds=function(placemark, audioElemQueue){


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



	//returns a list of paths to tracks for the placemark being queried
	var soundsEndpoint = "https://islamicgarden.ualberta.ca/api.php?placemarkName=";
	console.log(soundsEndpoint+placemark.name);
	var audioList = [];
	console.log(audioList);
	$.getJSON(soundsEndpoint+placemark.name,function(data){

		audioList = [];
		for(var i = 1; i < data.length;i++){


			audioList.push(data[i]);
			console.log("GETTING DATA FROM SOUNDS ENDPOINT");
			console.log(data[i]);

		}


	}).then(audioAcquireSuccess.bind(audioList));//finish the then from getJSON


	function audioAcquireSuccess(audioList){



		var placemarkAudioElements = document.getElementsByClassName("audio-"+placemark.name);
		var audioElement;

		for(var i = 0 ; i < audioList.length; i++){
			console.log("INSIDE INIT TRACK");
			console.log(audioList[i]);

			//TODO
			//WHY THE FUCK IS this. an empty array?bbbbbbbbb
			audioElement = audioElemQueue.pop();
			console.log("popped audio element: ");
			console.log(audioElement);
			audioElement.className = 'audio-'+placemark.name;
			var placemarkTag = audioElement.parentElement.getElementsByClassName('placemarkTag')[0];
			placemarkTag.innerHTML = placemark.name;
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

			audioElement.parentNode.style.display='block';
			audioElement.parentNode.style.visibility = "visible";

		}



	};




	};

	this.start = function(controller){


		var startButton = document.createElement("BUTTON");

		startButton.className = "startButton";
		startButton.innerHTML = "START";
		var startDiv = $(".start")[0];
		//console.log(startDiv);
		startDiv.innerHTML = '';
		startDiv.appendChild(startButton);
		startButton.addEventListener("click",function(){

		controller.initPage();

		this.parentNode.removeChild(this);
		//remove start div. It's not longer required
		startDiv.style.display='none';

		});



	}


};

window.onload = function(){

	var startFlag = false;
	var oldPlacemarks = [];

	var controller = new audioController();
	var placemarkController = new placemarkController();


	var mapperCheck = setInterval(function(){

		if(nearbyPlacemarks.length > 0){

		    for (var i = 0; i < nearbyPlacemarks.length;i++){

		    	oldPlacemarks[i] = nearbyPlacemarks[i];

		    }
		    clearInterval(mapperCheck);
		    startFlag=true;
		    controller.start(controller);



		}


		},1000);



	setInterval(function(){

    if (startFlag){

		if(oldPlacemarks){
			placemarkController.updateOldPlacemarks(oldPlacemarks,controller.audioElemQueue);

		}


    }


	},2000);





 function placemarkController(){

 	var newPlacemarksCounter= new Array(nearbyPlacemarks.length).fill(0);;

	this.oldPlacemarks=[];
	this.updateOldPlacemarks=function(oldPlacemarks, audioPlayerQueue){

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


			    }


			//console.log(newPlacemarksCounter[j]);
			//console.log(stillNear);
			if(newPlacemark){
			    //console.log("placemark no longer near");
			    //console.log(old);
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














	};



}




var audioObject = function(source, audioElement, placemarkName){

	this.loop = false;
	this.gainNode = audioElement['gainNode'];
	this.placemarkName= placemarkName;
	this.source = source;
	this.audioElem = audioElement;
	this.audioElem.className ='audio-'+placemarkName;

	this.mute = function(){};

	this.gainChangeDueToDistance = function(){


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

					var boundaryLatitude = nearbyPlacemarks[i].latitude + Number(nearbyPlacemarks[i].rectangle.width);
					var boundaryLongitude = nearbyPlacemarks[i].longitude + Number(nearbyPlacemarks[i].rectangle.length);

			    	var distanceBetweenPlacemarkCenterAndUser = distanceInKmBetweenEarthCoordinates(nearbyPlacemarks[i].latitude, nearbyPlacemarks[i].longitude, user.latitude, user.longitude);
			    	var distanceBetweenPlacemarkCenterAndBoundary = distanceInKmBetweenEarthCoordinates(nearbyPlacemarks[i].latitude, nearbyPlacemarks[i].longitude,boundaryLatitude , boundaryLongitude );



				    var newGainValue = 0 ;

				    newGainValue = 1 - (distanceBetweenPlacemarkCenterAndUser/distanceBetweenPlacemarkCenterAndBoundary);

				   	//console.log("newGainValue: " + newGainValue);
				   	//console.log(nearbyPlacemarks[i]);
				   	try{

				   		var placemarkName = nearbyPlacemarks[i].name;
				   		var placemarkAudioElements = document.getElementsByClassName('audio-'+placemarkName);
				   		for(var j = 0; j < placemarkAudioElements.length; j++){

				   			var distanceDisplay = placemarkAudioElements[j].parentElement.getElementsByClassName('distanceDisplay')[0];
				   			distanceDisplay.innerHTML='distance in metres between user and placemark : ' + distanceBetweenPlacemarkCenterAndUser.toFixed(5) * 1000;
					    	placemarkAudioElements[j]['gainNode'].gain.value = newGainValue;
					    	var gainDisplay = placemarkAudioElements[j].parentElement.getElementsByClassName('gainDisplay')[0];
					    	gainDisplay.innerHTML = 'gain value: ' + newGainValue.toFixed(5);


				   		}


				   	}
				   	catch(e){
				   		//wait until the placemarks get their audio context
				   		console.log("GAIN CHANGE ERROR" + placemarkName);
				   		console.log(e);

				   	}


				}
		    }













		};






};

var zoneAudio= function(source, audioElement, placemarkName){

	audioObject.call(this, source, audioElement, placemarkName);

	this.loop = false;
	this.defaultSource = "have a path here to a default audio track if user has already visited the zone.";

	this.checkZonesVisited=function(){





	};

};


var placemarkAudio = function(source, audioElement, placemarkName){

	audioObject.call(this, source, audioElement, placemarkName);

	this.loop = true;

	this.findTrackStartTime = function(){

		//get current time in seconds
		var currentTime = new Date().getTime() / 1000;

		var trackStartTime = currentTime % trackDuration;

		return trackStartTime;




	};


};



//timed Audio is for placemarks that can have a different source depending on the time of day.

var timedAudio = function(source, audioElement, placemarkName){

	audioObject.call(this, source, audioElement, placemarkName);

	this.loop = true;
	//IF we decide to keep a memoized list of the sources of the placemark audio, then this object should force to get the source from the backend each time.

	this.findTrackStartTime = function(){

		//get current time in seconds
		var currentTime = new Date().getTime() / 1000;

		var trackStartTime = currentTime % trackDuration;

		return trackStartTime;




	};

};








};
