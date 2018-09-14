var menuOpen = false;
var modalOpen = false;
var map;
var mapCenter = {lat: 33.971452, lng: -84.496482};

// Create the map view
function initMap() {
  //Define Map Styles
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    }, {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    }, {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];

  //Define map default location
  map = new google.maps.Map(document.getElementById('map'), {
    center: mapCenter,
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // Populate name in info window.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
      infowindow.open(map, marker);
    }
  }


  var request = {
    location: mapCenter,
    radius: '4500',
    type: ['park']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  // Create markers and populate model.
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        self.parkList.push( new Park(results[i]) );
        createMarker(results[i]);
      };
    }
  };

  //Markers creation
  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var placeName = place.name;
    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc,
      placeID: place.id,
      title: place.name,
      animation: google.maps.Animation.DROP
    });

    // Listen for marker actions
    marker.addListener('click', function() {
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
        var placeID=this.placeID;
        var theplace=this.position
        var place=this.title;
        modal(place);
      });
  }

}

// Modal view with Flickr API
var modal = function(place) {
  self.photoArray.removeAll();
  var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + place;
  $.ajax({
      url: flickerAPI,
      dataType: "jsonp",
      jsonpCallback: 'jsonFlickrFeed',
      success: function (result, status, xhr) {
        if (result.items.length > 0) {
          $.each(result.items, function (i, item) {
              self.photoArray.push( { url: item.media.m } );
          });
          document.getElementById("picModal").style.display = "block";
        } else { window.alert("No Flickr photos found for " + place +".  Please upload a current picture to Flickr when you visit!");
        };
      },
      error: function (xhr, status, error) {
          console.log(xhr);
          window.alert("Error "+xhr.statusText+". Please try again.");
      }
  });
  }


var Park = function(data){
  this.id = ko.observable();
  this.name = ko.observable(data.name);
  this.place_id = ko.observable(data.place_id);
  this.vicinity = ko.observable(data.vicinity);
  this.icon = ko.observable(data.icon);
  this.location = ko.observableArray();
}


var ViewModel = function(){

  var self=this;
  this.parkList = ko.observableArray([]);
  this.wikiArticles = ko.observableArray([]);
  this.photoArray = ko.observableArray([]);

  //Close menu and open InfoWindow on clicks
  this.listClick = function() {
    var placeID=this.place_id();
    var place=this.name();
    menuToggle();
    markerZoom(placeID);
    modal(place);
  }


  //Modal toggle
  this.modalOff = function() {
    document.getElementById("picModal").style.display = "none";
  }

  // Toggle Side Menu On/Off
  this.menuToggle = function() {
      var x = document.getElementById("markerList");
      if (menuOpen === false) {
          document.getElementById("markerList").style.width = "250px";
          document.getElementById("toggle").style.left = "250px";
          document.getElementById("h1").style.color = "transparent";

      } else {
          document.getElementById("markerList").style.width = "0";
          document.getElementById("toggle").style.left = "0";
          document.getElementById("h1").style.color = "525454";
      };
      menuOpen = !menuOpen;
  }

  // self.parkFilter = ko.observable();
  //
  // self.filteredParks = ko.computed(function() {
  //   var parkFilter = self.parkFilter();
  //   if (!parkFilter) { return self.filteredParks(); }
  //   return self.filteredParks().parkFilter(function(i) { return i.indexOf(parkFilter) > -1; });
  // });
};

ko.applyBindings(ViewModel());
