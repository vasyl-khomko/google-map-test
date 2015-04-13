
var markers = [];
var xmlhttp = new XMLHttpRequest();
var clientId = "3MXKAY4WVJSTXY5NFG5XE5PLCB2WHXE4KNZQKGY2NLURWPII";
var clientSecret = "KRT1M34HTY4PPI0Q1FE4GMWYRS1UBCAGCUBGKW2WUYPMJI5U";
var map;

Template.map.rendered = function() {
  var mapOptions = {
    center: {lat: 35.673343, lng: 139.710388},
    zoom: 14
  };

  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  /*navigator.geolocation.getCurrentPosition(function (position) {
    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  });*/
};

Template.map.events ({
  'submit form': function(event) {
    deleteMarkers();
    Venues.remove({});
    var query = document.getElementById("query").value;
    if (!query.trim()) {
      return false;
    }

    var northEast = map.getBounds().getNorthEast();
    var southWest = map.getBounds().getSouthWest();
    var northWest = new google.maps.LatLng(northEast.lat(), southWest.lng());
    var radius = getDistance(southWest, northWest)/2;
    var center = map.getCenter();

    var url = getFoursquareUrl(center, radius, query);
    
    var queryItem = {
    	query : query,
    	latitude : center.lat(),
    	longitude : center.lng(),
    	radius : Math.round(radius)
    };

    Meteor.call('queryInsert', queryItem, function(error, result) {    
      if (error)
        return alert(error.reason);
    });

    xmlhttp.onreadystatechange = handleServerResponse;
    xmlhttp.open('GET', url,true);
    xmlhttp.send();
    return false;
  }
});

function rad(x) {
  return x * Math.PI / 180;
}

function getDistance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * 
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
}

// Add a marker to the map and push to the array.
function addMarker(location, title) {
  var marker = new google.maps.Marker({
    position: location,
    title: title,
    map: map,
    icon:'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function handleServerResponse() {
  if (xmlhttp.readyState == 4) {
    // only if "OK"
    if (xmlhttp.status == 200) {
      var obj = JSON.parse(xmlhttp.responseText);
      var venues = obj.response.venues;
      
      for (i = 0; i < venues.length; i++) {
        var location = new google.maps.LatLng(venues[i].location.lat, venues[i].location.lng);
        addMarker(location, venues[i].name);
        Venues.insert({
          name: venues[i].name,
          city: venues[i].location.city,
          address: venues[i].location.address,
          latitude: venues[i].location.lat,
          longitude: venues[i].location.lng
        });
      }
    } else {
      alert("Failed to get the data:\n" + xmlhttp.statusText);
    }
  }
}

function getFoursquareUrl(center, radius, query) {
  var ll = ""+center.lat()+","+center.lng();
  return "https://api.foursquare.com/v2/venues/search?client_id="
    +clientId+"&client_secret="+clientSecret+"&v=20130815&ll="
    +ll+"&radius="+radius+"&query="+query;
}
