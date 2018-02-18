//This function will operate the majority of the javascript functionality
//provided by google maps api

//variable for the location url to retireve json on bus_stations in the area
var locationURL;

//variable for the json that is returned back from the locationURL
var googlePlaces;

var lat;
var lng;

function initMap() {

    var infoWindow = new google.maps.InfoWindow();

    //initiates map and centers it to USA middle
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {lat: 40, lng: -95}
    });

    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    var iconImage = {
    bus: {
      url: 'http://localhost:3000/icons/AWT-Bus.png',
      size: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12)
    },

    train: {
      url: 'http://localhost:3000/icons/AWT-train.png',
      size: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12)
    },

    lyftCar: {
      url: 'http://localhost:3000/icons/Car.png',
      size: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12)
    },

    unknown: {
      url: 'http://localhost:3000/icons/AWT-location.png',
      size: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12)
    }
  };
    //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    /*
    var icons = {
      bus: {
        icon: 'parking_lot_maps.png'
      },
      train: {
        icon: 'library_maps.png'
      }
    };
*/

  // Adds a marker to the map and push to the array.
     function addMarker(location, title, transitType, iconType) {
         console.log(iconType);
         var marker = new google.maps.Marker({
         position: location,
         //icon: iconBase + 'parking_lot_maps.png',
         icon: iconImage[iconType],
         map: map
       });


       //listens for when the cursor scrolls over the marker to display the infowindow
       marker.addListener('mouseover', function() {
         infoWindow.close();
         infoWindow.setContent("<div id='infoWindow'><h2>" + transitType + "</h2><h1>" + title + "</h1></div>");
         infoWindow.open(map, marker);
       });

       //markers.push(marker);
     }

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

  //autocomplete and retrieve lat and lng for markers
  var input = document.getElementById('autocomplete');
  var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    var place = autocomplete.getPlace();
    //deleteMarkers();
    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();
    var location = {lat: lat, lng: lng};//sets variable location to given city
    locationURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ lat + "," + lng +"%26sensor=true%26key=AIzaSyAVU6qsGHwi9ARnA7RuxUIH20oqPiQiCv8%26radius=1000%26types=train_station";
    loadDoc();
    locationURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ lat + "," + lng +"%26sensor=true%26key=AIzaSyAVU6qsGHwi9ARnA7RuxUIH20oqPiQiCv8%26radius=1000%26types=bus_station";
    loadDoc();
    //locationURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ lat + "," + lng +"%26sensor=true%26key=AIzaSyAVU6qsGHwi9ARnA7RuxUIH20oqPiQiCv8%26radius=1000%26types=transit_station";
    //loadDoc();
    map.setZoom(15);//zooms in on city selected
    map.panTo(location);//pans to city selected
    //addMarker(location);//adds the marker to the map
    })
    //loads the url api to grab the json from that url given the location parameter inputed
    function loadDoc() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this);
           const responseJson = JSON.parse(this.response);
           const googlePlaces = responseJson.googlePlaces;
           const lyftData = responseJson.lyft;

           console.log(googlePlaces);
           //console.log(this.responseText);
           //var obj = JSON.parse(this.responseText)
           //for property in this.responseText {
           //console.log(googlePlaces['next_page_token']);

           console.log(lyftData);
           for(let driver of lyftData.nearby_drivers) {
             var lat = driver.drivers[0].locations[0].lat;
             var lng = driver.drivers[0].locations[0].lng;
             var location = {lat: Number(lat), lng: Number(lng)};

             var markerTitle = "Driver";
             var transitType = "Lyft";
             var iconType = "lyftCar";

            addMarker(location, markertitle, transitType, iconType);

           }
           var transitType;
           var iconType;
              for(var i in googlePlaces['results']) {
                var lat = googlePlaces['results'][i]['geometry']['location']['lat'];
                var lng = googlePlaces['results'][i]['geometry']['location']['lng'];
                var markertitle = googlePlaces['results'][i]['name'];
                //console.log(googlePlaces['results'][i]['types'][0]);
                if(googlePlaces['results'][i]['types'][0] == "bus_station") {
                  transitType = "Metro Bus";
                  iconType = "bus";
                }
                else if(googlePlaces['results'][i]['types'][0] == "train_station") {
                    transitType = "Metro Train";
                    iconType = "train";
                }

                else if(googlePlaces['results'][i]['types'][0] == "subway_station") {
                  transitType = "Metro Subway";
                  iconType = "train";
                }

                  else if(googlePlaces['results'][i]['types'][0] == "transit_station") {
                    transitType = "Bus/Train Station";
                    iconType = "unknown";
                }

                else {
                  continue;
                }

                var location = {lat: Number(lat), lng: Number(lng)};
                //console.log(icon);
                addMarker(location, markertitle, transitType, iconType);
              }
          }
        };
        var params = "passedURL=" + locationURL+ "&latitude=" + lat + "&longitude=" + lng;

        //console.log(params);

        xhttp.open("GET", "/getplaces?" + params, true);
        xhttp.send();
    }

}
