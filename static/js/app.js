/* ======= Global Variables ======*/
var map;
var largeInfowindow;
/* ======= Google Map ======= */
// Function to initilize map.
function initMap() {
  // Create mapElem
  this.mapElem = document.getElementById('map');
  // Create initial infowdinow variable
  var largeInfowindow = new google.maps.InfoWindow();
  // Create initial bounds variable
  var bounds = new google.maps.LatLngBounds();
  markers = [];
  map = new google.maps.Map(this.mapElem, {
    center: {lat: 42.2683199, lng: -71.8174296},
    zoom: 13
  });
  console.log("Map created!");
  // For loop to create and push markers
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
  }
  // Fit the bounds.
  map.fitBounds(bounds);
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
  var self = this;
  // Create ko observable for search input.
  self.searchLocation = ko.observable();
  // Create KO observable array for markers
  self.markerList = ko.observableArray([]);
  // Push markers to marker list observable array.
  markers.forEach(function(marker) {
    self.markerList.push(marker);
  });
  // Create KO observable array for locatoins
  self.locationList = ko.observableArray([]);
  // Go through locations array and create a observable array.
  locationsData.forEach(function(location){
    self.locationList.push({name: location.title});
  });
  // Hide pane function
  self.hidePane = function() {
  };
  // Filter search function
  self.filterSearch = function() {
  };
  // Select marker function
  self.selectMarker = function() {
    console.log("Clicked!");
  };
};
