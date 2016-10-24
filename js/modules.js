function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}

// js for the menu bar

function home() {
	var home = document.getElementById("homebtn");
    location.href = "index.html";
}

// js for the dropdown menu
function dropdown() {
  var menu = document.getElementById("myDropdown");
  menu.classList.toggle("show");
  };

function search() {
  // search js here
};

function about() {
  location.href = "about.html";
};

function garden() {
  location.href = "http://www.devonian.ualberta.ca";
};

function contact() {
  location.href = "http://devonian.ualberta.ca/Contact-Us";
};

function mapOfGarden(){

  //TODO on map pin click
  alert("button is not yet implemented");


};

// js for index.html

function learn() {
    location.href = "menulearn.html","_self";
}

function play(){

  location.href = "menuplay.html","_self";

};

function tour(){

  location.href = "menutour.html","_self";

};

function reflect(){

  location.href ="reflect.html","_self";


};

function question(){

  location.href ="menuquestion.html";

};

// revise this function to point to the new module menu.
function template() {
    location.href = "menutemplate.html","_self";
}



function pg2() {
location.href = 'pg2.html';
}



function video1() {
  location.href = "learnhumay.html";
};

function back() {
    location.href = "menulearn.html";
};

function fade() {
var instructions = document.getElementById("instructions");
instructions.style.opacity=0;
instructions.style.zIndex="1";
};





