window.onload=function(){

	var locationChange=0;
	var audioElement = document.getElementsByTagName('AUDIO')[0];
	// audioElement.style.display='none';


	audioElement.addEventListener("canplaythrough", function(){

    	console.log('checkingCanplaythrough listener');
    	console.log(this.duration);
    	console.log(this);
    	var timeToStart =  findTrackStartTime(this.duration);
    	console.log('timeToStart: '+timeToStart);
    	
    	//because in most browsers setting currentTime forces canplaythrough event again.
    	if(this.currentTime < timeToStart){

    		this.currentTime = timeToStart;


    	}

	});



	//of the track.
	function findTrackStartTime(trackDuration){
		//track duration should be in seconds

		//get current time in seconds
		var currentTime = new Date().getTime() / 1000;
		console.log("currentTime: " + currentTime);
		console.log("trackDuration: "+ trackDuration);
		var trackStartTime = currentTime % trackDuration;
		console.log("trackStartTime" + trackStartTime);
		return trackStartTime;  




	}






	audioElement.onpause=function(){


		if(locationChange===1){
			this.src = '../assets/Vol04-Tr02.wav';
			this.load();
			this.play();
			locationChange++;
		}



	};


	console.log(audioElement);
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	var realAudio = audioCtx.createMediaElementSource(audioElement);
	var analyser = audioCtx.createAnalyser();

	realAudio.connect(analyser);
	analyser.connect(audioCtx.destination)



	setTimeout(function(){


		audioElement.pause();
		locationChange=1;


	},10000);






}