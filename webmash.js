/*
    Student Name: AMAN KAUR GANDHI
    UTA ID :  1001164326
 
*/

var username = "amankaur";
var request = new XMLHttpRequest();
var marker;
var infowindow;
 var geocoder ;
 var address;
 var array = new Array();
var contentString;
//initMap() which initiates map to a location
function initMap() {

	//initialize map
	map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.75, lng: -97.13},
          zoom: 17
        });
	//Initialize a mouse click event on map which then calls reversegeocode function
 google.maps.event.addListener(map, "click", function (event) {
 address = event.latLng;
geocoder = new google.maps.Geocoder; 

reversegeocode(geocoder,map, address);
document.getElementById("clearOutput").addEventListener("click", clear);
});


}

function clear() {
array.length =0;
document.getElementById("output").innerHTML = "";
//array.splice(0, array.length);
}
// Reserse Geocoding 
function reversegeocode(geocoder, map, address) {


  //get the latitude and longitude from the mouse click and get the address.
  
	 var latitude =address.lat();
var longitude = address.lng();
var latlng = {lat: latitude, lng: longitude};

geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              map.setZoom(11);
              
      if (marker) {
        //if marker already was created change positon
        marker.setPosition(address);

    } else {
        //create a marker
        marker = new google.maps.Marker({
            position: address,
            map: map,
            draggable: true
        });
		}
		if(infowindow){
		 infowindow.close();
		};
		 sendRequest(latitude,longitude);
		 contentString=results[0].formatted_address;
		infowindow = new google.maps.InfoWindow({
           // content: contentString,
           maxWidth: 300
        });
 //infowindow.setContent(results[1].formatted_address);
             // infowindow.open(map, marker);

  //});

	
   
              
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
//encodeURI(infowindow.getContent());

  //call geoname api asynchronously with latitude and longitude 
  //var cont= sendRequest(latitude,longitude);
}// end of geocodeLatLng()



function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var temperature = xml.getElementsByTagName("temperature")[0].innerHTML;
		var windSpeed = xml.getElementsByTagName("windSpeed")[0].innerHTML;
		var clouds= xml.getElementsByTagName("clouds")[0].innerHTML;
		//var array=new Array();
		array.push("\n\nAddress:"+'\n'+contentString +'\n'+"Weather Details:"+'\n'+ "Temperature: "+temperature +" WindSpeed: "+windSpeed +" Clouds: "+clouds ); 
		document.getElementById("output").innerHTML = array;
	//document.getElementById("output").innerHTML = "temperature: "+temperature +" windSpeed: "+windSpeed +" clouds: "+clouds ;
	//infowindow.Content(temperature+windSpeed+clouds);
			
	contentString= "<b>Address:</b>"+"<br/>"+ contentString +"<br/> <br/>"+"<b>Weather Details:</b>"+"<br/>"+ "Temperature: "+temperature +" WindSpeed: "+windSpeed +" Clouds: "+clouds;
	
	infowindow.setContent(contentString);
	 infowindow.open(map, marker);
    }
}

function sendRequest (latitude,longitude) {

    request.onreadystatechange =
function() {
        if (request.readyState == 4) {
            displayResult();
        }
	};
    var lat = latitude;
    var lng = longitude;
	
    request.open("GET",encodeURI("http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username),true);
    //request.withCredentials = "true";
	
    request.send(null);
}
