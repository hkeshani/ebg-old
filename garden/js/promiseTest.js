window.onload = function(){


var audio = document.createElement("audio");

var src  = document.createElement("source");

src.src = "../assets/Vol-06-Track-02.ogg";

audio.appendChild(src);

var body = document.getElementsByTagName("BODY")[0];

body.appendChild(audio);

var button = document.createElement("BUTTON");


button.innerHTML = "PLAY";

var audioPromise;

var user = false;

var promiseList = [];

var newPromise = new Event("PromiseAvailable");

button.addEventListener("click", function(event){

  console.log(event);
  audioPromise = audio.play();
  promiseList.push(audioPromise);
  promiseList.dispatchEvent("PromiseAvailable");


});
console.log(promiseList);

body.appendChild(button);

var x = document.createElement("AUDIO");
x.addEventListener("PromiseAvailable", function(){

  for (var i = 0 ; i < promiseList.length; i++){


    if(promiseList[i]){

      console.log("we out here fam");
      break;

    }

  }




});


// var newPlacemark = true;
//
// if(newPlacemark){
//
//
// audioPromise.then(function(event){
//
// console.log("inside the promise of play()");
//
//
//
// });
//
//
// }


};



var playAudio = function(){









};
