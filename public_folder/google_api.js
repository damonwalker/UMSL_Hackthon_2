//This function will operate the majority of the javascript functionality
//provided by google maps api

var markers = [];
var locationURL;
var responseJSON;

function initMap() {

  //initiates map and centers it to USA middle
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 40, lng: -95}
  });

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>' +
      '<h1 id = "firstHeading" class="firstHeading">Type</h1>' +
      '<div id="bodyContent">' +
      '<p><b>information</b></p>' +
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
  content: contentString
  });

  // Adds a marker to the map and push to the array.
     function addMarker(location) {
         marker = new google.maps.Marker({
         position: location,
         map: map,
       });

       marker.addListener('click', function() {
         infowindow.open(map, marker);
       });

       markers.push(marker);
     }
/*
   // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

 // Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  setMapOnAll(null);
  markers = [];
}
*/
  //autocomplete and retrieve lat and lng for markers
  var input = document.getElementById('autocomplete');
  var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    var place = autocomplete.getPlace();
    //deleteMarkers();
    var location = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};//sets variable location to given city
    locationURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=location&sensor=true&key=AIzaSyAVU6qsGHwi9ARnA7RuxUIH20oqPiQiCv8&rankby=distance&types=bus_station";
    loadDoc();
    map.setZoom(11);//zooms in on city selected
    map.panTo(location);//pans to city selected
    addMarker(location);//adds the marker to the map
    })
}



function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       responseJSON = JSON.parse(this.responseText);
       console.log(this.responseText);
      }
    };
    xhttp.open("GET", "/getplaces", true);
    xhttp.send();
}
