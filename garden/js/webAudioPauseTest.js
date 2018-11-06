window.onload = function(){




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

		var audioElement = document.getElementsByTagName("AUDIO")[0];
		var webAudioSource = audioContext.createMediaElementSource(audio);
		var gainNode = audioContext.createGain();

		webAudioSource.connect(gainNode);


		gainNode.connect(audioContext.destination);

		var startButton = document.createElement('BUTTON');
		var audioPromise;
		var LoadPromise;
		startButton.innerHTML="START";
		startButton.addEventListener("click",function(){

			audioPromise = audioElement.play();


		});

		var changeButton = document.createElement('BUTTON');
		changeButton.innerHTML="Change Track";
		changeButton.addEventListener("click",function(){

			if (audioPromise!== undefined){
					audioPromise.then({
						return audioElement.pause()}).then({
						var sourceForTrack = currentAudio.getElementsByTagName("SOURCE")[0];
						sourceForTrack.src = "assets\\Vol04-Tr02.ogg";
						return audioElement.load();

					}).then(audioElement.play());

			}



		});


		var body = document.getElementsByTagName("BODY")[0];
		body.appendChild(startButton);






};
