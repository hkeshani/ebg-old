console.log('outside onload...');
window.onload = function(){
	

	var newPlacemarkFound = false;

	var playButton = document.getElementById("playButton");

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var source = audioCtx.createBufferSource();
	var scriptNode = audioCtx.createScriptProcessor();
	//var source2 = audioCtx.createBufferSource();
	//var scriptNode2 =audioCtx.createScriptProcessor(4096);

	console.log(scriptNode.bufferSize);

	// When the buffer source stops playing, disconnect everything
	source.onended = function() {
		console.log('TRACK IS DONE.');
	 
	  source.disconnect(scriptNode);
	  scriptNode.disconnect(audioCtx.destination);
	  source = audioCtx.createBufferSource();

	  getData('/assets/Vol03-Tr02.wav');
	  source.connect(scriptNode);
	  scriptNode.connect(audioCtx.destination);
	  console.log('second song should start or will now Loop');
	  source.start();

	}


	function getData( trackPath ) {
	  request = new XMLHttpRequest();
	  request.open('GET', trackPath , true);
	  request.responseType = 'arraybuffer';
	  console.log('jsut wondering if this will ever work...');
	  request.onload = function() {
	    var audioData = request.response;

	    audioCtx.decodeAudioData(audioData, function(buffer) {
	    myBuffer = buffer;   
	    source.buffer = myBuffer;
	  },
	    function(e){"Error with decoding audio data" + e.err});
	  }
	  request.send();
	/*  request2 = new XMLHttpRequest();
	  request2.open('GET','/assets/Vol04-Tr02.wav');
	  request.responseType='arraybuffer';
	  request2.onload= function(){

	  	var audioData = request2.response;
	  	audioCtx.decodeAudioData(audioData,function(buffer){


	  		theBuffer = buffer;
	  		source2.buffer = myBuffer;

	  	});


	  }
	  request2.send();*/

	}

	// Give the node a function to process audio events
	scriptNode.onaudioprocess = function(audioProcessingEvent) {
	  // The input buffer is the song we loaded earlier
	  var inputBuffer = audioProcessingEvent.inputBuffer;

	  // The output buffer contains the samples that will be modified and played
	  var outputBuffer = audioProcessingEvent.outputBuffer;

	  // Loop through the output channels (in this case there is only one)
	  for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
	    var inputData = inputBuffer.getChannelData(channel);
	    var outputData = outputBuffer.getChannelData(channel);

	    // Loop through the 4096 samples
	    for (var sample = 0; sample < inputBuffer.length; sample++) {
	      // make output equal to the same as the input
	      outputData[sample] = inputData[sample];

	        
	    }
	  }
	}

	getData('/assets/Vol01-Tr03.wav');

	// wire up play button
	playButton.onclick = function() {
	  source.connect(scriptNode);
	  scriptNode.connect(audioCtx.destination);
	  source.start();
	  console.log('play was clicked');
	  console.log(source);
	  setTimeout(function(){
	  	source.stop();
	  	console.log('yo please');




	  	},17000);
	}
      


}



function checkIfInNewPlacemark(){







}