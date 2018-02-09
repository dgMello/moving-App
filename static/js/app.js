/* ======= Global Variables ======*/
var map;
var largeInfowindow;
var bounds
/* ======= Google Map ======= */
// Function to initilize map.
function initMap() {
  // Create mapElem
  this.mapElem = document.getElementById('map');
  // Create initial infowdinow variable
  largeInfowindow = new google.maps.InfoWindow();
  // Create initial bounds variable
  bounds = new google.maps.LatLngBounds();
  markers = [];
  map = new google.maps.Map(this.mapElem, {
    center: {lat: 42.2683199, lng: -71.8174296},
    zoom: 13
  });
  console.log("Map created!");

  ko.applyBindings(new viewModel());
};

// Variable contaning locations info.
var locationsData = [
  {
    title: 'Worcester Art Museum',
    location: {lat: 42.2730221, lng: -71.8019689}
  },
  {
    title: 'Hanover Theatre',
    location: {lat: 42.2607026, lng: -71.8029641}
  },
  {
    title: 'Worcester State',
    location: {lat: 42.2677103, lng: -71.8440334}
  },
  {
    title: 'Wormtown Brewery',
    location: {lat: 42.2634965, lng: -71.7912016}
  },
  {
    title: 'Armsby Abbey',
    location: {lat: 42.2687583, lng: -71.8007635}
  }
]


/* ======= ViewModel ======= */
var viewModel = function() {
  console.log("The bindings have binded!");

  /*==== Variables ====*/

  var self = this;
  var markers = [];

  /*==== Create Markers ====*/

  // Create markers  // For loop to create and push markers
  for (var i = 0; i < locationsData.length; i++) {
    // Get postion from locaton var
    var position = locationsData[i].location;
    // Get title from locaton var
    var title = locationsData[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the markers to the map.
    markers.push(marker);
    // Extend the bounds with each marker.
    bounds.extend(markers[i].position);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }
  // Fit the bounds.
  map.fitBounds(bounds);

  /*==== ko observables ====*/

  // Create ko observable for search input.
  self.searchLocation = ko.observable();
  // Create KO observable array for markers
  self.markerList = ko.observableArray([]);
  // Push markers to marker list observable array.
  markers.forEach(function(marker) {
    self.markerList.push(marker);
  });
  // Create ko obersable boolean for search panel visibility.
  self.showSearchPanel = ko.observable(true);
  // Create KO observable array for locatoins
  self.locationList = ko.observableArray([]);
  // Go through locations array and create a observable array.
  locationsData.forEach(function(location){
    self.locationList.push({name: location.title});
  });

  /*==== KO Functions ====*/

  // Toggle pane function
  self.toggleSearchPane = function() {
    if (self.showSearchPanel()) {
      self.showSearchPanel(false);
      $("#hidePaneButton").attr("title","Show Search Pane");
    } else {
      self.showSearchPanel(true);
      $("#hidePaneButton").attr("title","Hide Search Pane");
    }
  };
  // Filter search function
  self.filterSearch = function() {
    console.log("Clicked!");
  };
  // Select marker function
  self.selectMarker = function() {
    console.log("Clicked!");
  };

  /*==== functions ====*/

  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }
};
