
$(window).load(function(){


    /*placemarkSounds = {

		"Boyan's House" : ["../assets/01.mp3"],
		"U of A" : ["../assets/02.mp3"],
		"Comp Sci": []

	};

	*/
var mapperCheck = setInterval(function(){
    		console.log("am I even intervaling right?");
		if(user.currentPlacemark){

			clearInterval(mapperCheck);
			start();

		}


	},1000);



    //mapperCheck();


});

function start(){
	 
    if (user.currentPlacemark){
	

	var currentPlacemark = user.currentPlacemark
	var canvas = $(".map")[0];
	var context = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	context.fillText(currentPlacemark.name,10,50);
		
	canvas.addEventListener("click",function(click){
	    

	    console.log(click.clientX);
	    console.log(click.clientY)
	    
	    
	});
	
	
	
		
	
        initializeSounds(currentPlacemark.name);
	
	var oldPlacemark = currentPlacemark;
	
	
        //check every once in a while if the placemark has changed 
	
        setInterval(checkForNewPlacemark(oldPlacemark),4000);
	
	
    }
    
    
    
    
};

function initializeSounds(placemarkName){

    // either hit a backend using the user.currentPlacemark.name as an identifier 
    // or have a list somewhere of the tracks that need to be played for each placemark


    //HERE WE WOULD GET A REAL AUDIO LIST DEPENDING ON THE NAME OF THE PLACEMARK



    var trackList = [
    { "name": "Boyan's House",
    	"sounds" :["https://www.freesound.org/data/previews/199/199512_3714704-lq.mp3","https://www.freesound.org/data/previews/243/243953_1565498-lq.mp3", "http://freesound.org/data/previews/362/362820_3247643-lq.mp3"]	 },
    {"name":"Comp Sci Building",
		"sounds":["http://freesound.org/data/previews/320/320878_5354192-lq.mp3"] },
    {"name":"CCIS",
		"sounds":["http://freesound.org/data/previews/338/338986_5106192-lq.mp3"]},
    {"name":"Old Arts Building",
		"sounds":["http://www.freesound.org/data/previews/352/352828_4159791-lq.mp3"]}

    ];



    //var trackList =  Placemarks[placemarkName];

    var audioList = [];

    for(var i = 0; i < trackList.length ; i++){

    	if (placemarkName == trackList[i].name){

    		audioList = trackList[i].sounds;
    		break;
    	}


    }

    console.log(placemarkName);
    console.log(audioList);
    var body = $("body")[0];

    for(var i = 0; i < audioList.length ; i++ ){

    var divWrap = document.createElement("DIV");
    divWrap.id = i ;
    var soloButton = document.createElement("BUTTON");
    soloButton.id= i ;
    soloButton.innerHTML = "S";
    soloButton.className="soloButton";
    soloButton.style.color="white";
    divWrap.appendChild(soloButton);
    var muteButton = document.createElement("BUTTON");
    muteButton.id= i ;
    muteButton.innerHTML = "M"
    muteButton.className="muteButton";
    muteButton.style.color="white !important";
    divWrap.appendChild(muteButton);

    divWrap.className= "audioWrap";
    var audio = document.createElement("AUDIO");
    audio.loop = true;
    audio.className = "audio"
    audio.id = i;
    var source = document.createElement("SOURCE");
    source.src =audioList[i] ;
    audio.appendChild(source);

    var nameOfAudio = "placeHolder";
    var par = document.createElement("p");
    par.innerHTML = nameOfAudio;
    divWrap.appendChild(par);

    divWrap.appendChild(audio);
    body.appendChild(divWrap);
    audio.play();

    muteButton.addEventListener("click", function(event){

    var currentAudio = this.parentNode.getElementsByTagName("audio")[0];
    var allAudio = document.getElementsByTagName('audio');

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

	    //currentAudio.volume = 1;
	    
	    this.style["background-color"]="black";
    }

    });


    soloButton.addEventListener("click", function(event){

   	var buttonID = this.id;
	var currentAudio = this.parentNode.getElementsByTagName("audio")[0];

    var allAudio = document.getElementsByTagName('audio');

    if(currentAudio['soloed']===true){
	    //WHEN A SOUND IS BEING UN-SOLOED
	    this.style["background-color"]="black";
	    currentAudio['soloed'] = false;
	    for(var index = 0; index < allAudio.length; index++ ){

	    	if(allAudio[index]['soloed'] == true  ){

	    		currentAudio.volume = 0;
	    		console.log(currentAudio.volume);

	    	}


	    }

	    for(index = 0; index < allAudio.length; index++){

		    var idToCheck = allAudio[index].id;

		    if(allAudio[index]["muted"]!==true){

			    allAudio[index].volume = 1;

		    }

	    }


    }

    else{
	    //WHEN A SOUND IS BEING SOLOED
	    currentAudio['soloed'] = true;
	    this.style["background-color"]="red";
	    console.log(buttonID);
	    console.log(allAudio);

	    for(var index = 0; index < allAudio.length; index++){

		    var idToCheck = allAudio[index].id;
	
		    if(idToCheck != buttonID){
		    	console.log("allAudio[index]['soloed']:" + allAudio[index]["soloed"]) ;
			    allAudio[index].volume = 0;

		    }
		    if(allAudio[index]["soloed"]==true){

		    	allAudio[index].volume = 1;

		    }

	    }

    }




    });




    }







}


function checkForNewPlacemark(oldPlacemark){


    //user defined in mapper.js 
    if(user.currentPlacemark.name !== oldPlacemark.name ){



        //function to redo audio stuff.
        audioTrackCleanup();
        initializeSounds(user.currentPlacemark.name);
        updatePlacemark(user.currentPlacemark);

        
    }

}



function audioTrackCleanup(){



    var audioWraps = $(".audioWrap");

    for(var i = 0 ; i < audioWraps.length; i++){

        while(audioWraps[i].firstChild){

            audioWraps[i].removeChild(audioWraps[i].firstChild);
        }


    }






}


function updatePlacemark(newPlacemark){


	var canvas = $("canvas")[0];
	var context = canvas.getContext("2d");
	//do other thing with the canvas here not just this.
	//TODO
	context.font="3em Georgia";
	context.fillText(newPlacemark.name,10,50);










}
