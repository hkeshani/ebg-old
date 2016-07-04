Dear reader

you are looking at Treasuremapper 5. It's not really the fifth version, but it's a remake of our old Treasuremapper software (chich only worked on Nokia phones), but using HTML5 technology.

These files have been cobbled together by the NetNiet.org foundation. The NetNiet.org foundation promotes wireless media art in public space. We hope culturally interested people and institutions will use this as a basis for their exploration of HTML5 and locative media.

The main files are:

map.kml - This is the file that you want to replace with your own KML file. Open the KML file with a textreader to understand what's going on: it's really just a long list of spaces ('placemarks). Each consists of a list of coordinates that represent the corners of the space, coupled with some HTML that will be shown once the user is inside the corresponding place. You can open it in Google Earth too if you want, it's really just  standard type of file. Standards rule!

index.html - This is the heart of the whole operation. It houses the javascript bits that load in the map.kml file and continuously compare it's list of places to the user's current location.

Screen.css - this tells the browser how to make the webpage look visually. Most importantly, it currently hides the 'debug' information from view. If you remove the last bit from it (the bit surrounding 'display:none') you will make the debug information visible again. Compare it to opening up the hood of your car to se what's going on inside. Then you will be able to see and learn better what the software does as you use it.

All the other files house some scripts that the main index.html file calls upon. Geo.js houses some bits about using the GPS of the phone, helpers.js contains various little bits of supporting code, and the jquery file.. well just google that.

-

Finally, you're looking at an ahhpa product. It's not very clean, there are some extra bits that may not even be used in this version. We're still playing with it ourselves, and you are hereby given a copy of our kitchen. Enjoy.

-

This was all put together by Tijmen Schep. You can reach him at tijmen@netniet.org. Tijmen regularly lectures and hosts workshops on locative media and locative storytelling. Find out more of some of the previous things we did on netniet.org.

We tried to respect copyright as well as we could. If you feel this software breaches your copyright in any way, please contact us and we will change the code to work without your bit.