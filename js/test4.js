window.onload = function(){


//
// var url = 'https://islamicgarden.ualberta.ca/flask/assets/Valley3.txt'
//
// function getDescriptionFromTextFile(textFileURL){
//
//
//     if (window.XMLHttpRequest)
//     {// code for IE7+, Firefox, Chrome, Opera, Safari
//         xmlhttp=new XMLHttpRequest();
//     }
//     else
//     {// code for IE6, IE5
//         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//     }
//     xmlhttp.onreadystatechange=function()
//     {
//         if (xmlhttp.readyState==4 && xmlhttp.status==200)
//         {
//             return xmlhttp.responseText;
//         }
//     }
//     xmlhttp.open("GET", textFileURL, false );
//     xmlhttp.send();
//
//     var description = xmlhttp.responseText;
//
//     console.log('DESCRIPTION IS:----------------');
//
//     console.log(description);
//

function isPointInPoly(poly, pt)
	{
		//this doesn't work when it tries to look at negative values for longitude and/or lattitude
		//I am trying to make them absolute values since in Edmonton  longitude is  negative.
		var positvePoly = poly.map(function(coords){
			//map the array inside of the array to have positive values
			return coords.map(Math.abs(x));
		});
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((positivePoly[i][0] <= pt.latitude && pt.latitude < positivePoly[j][0]) || (positivePoly[j][0] <= pt.latitude && pt.latitude < positivePoly[i][0]))
        && (pt.longitude < (positivePoly[j][1] - positivePoly[i][1]) * (pt.longitude - positivePoly[i][0]) / (positivePoly[j][0] - positivePoly[i][0]) + positivePoly[i][1])
        && (c = !c);
    return c;
	}


var polygon = [[-113.5461688,53.4881477],
[-113.5459649,53.4875413],
[-113.5465765,53.4869859],
[-113.5430145,53.4869986],
[-113.5429931,53.4882498],
[-113.5461688,53.4881477]];

var user = {latitude:53.486820,
						longitude:-113.544315};


console.log(isPointInPoly(polygon,user));
};


// getDescriptionFromTextFile(url);
//
// var obj = function(){
//
//
// 	this.audioContext = 0;
//
//
// 	this.createAudioContext = function(){
//
//
//
// 		var audioContext;
//
// 		try{
//
// 		    window.AudioContext=window.AudioContext||window.webkitAudioContext;
//
// 		    audioContext = new AudioContext();
//
// 		}
//
// 		catch(e){
//
//
// 			alert("error: " + e);
//
//
// 		}
//
// 		this.audioContext = audioContext;
// 		return this.audioContext;
//
//
// 	};
//
//
// 	this.getAudioContext = function(){
//
// 		return this.audioContext || this.createAudioContext();
//
//
// 	};
//
//
//
// };
//
// console.log('yo....');
// var x = new obj();
// console.log(x.getAudioContext());
//};
