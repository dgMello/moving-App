/* ======= Google Map ======= */
var map;
// Function to initilize map.
function initMap() {
  // Create mapElem
  this.mapElem = document.getElementById('map');
  // Create initial infowdinow variable
  var largeInfowindow = new google.maps.InfoWindow();
  // Create initial bounds variable
  var bounds = new google.maps.LatLngBounds();
  markers = viewModel.getMarkers();
  map = new google.maps.Map(this.mapElem, {
    center: {lat: 42.2683199, lng: -71.8174296},
    zoom: 13
  });
  console.log("Map created!");
  // Create location var from using viewModel function getMakers.
  markers = viewModel.getMarkers();
  // Create location var from using viewModel function getLocations.
  locations = viewModel.getLocations();
  // For loop to create and push markers
  for (var i = 0; i < locations.length; i++) {
    // Get postion from locaton var
    var position = locations[i].location;
    // Get title from locaton var
    var title = locations[i].title;
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
  // Update the markers variable in your model with the updateMakers function.
  viewModel.updateMakers(markers);
};


/* ======= Model ======= */


// Models for mover app.
var model = {
  // Marker Variable
  markers: [],
  // List of locations that will be made into markers and info windows.
  locations: [
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
};


/* ======= ViewModel ======= */


var viewModel = {
  // Function to initilize app
  init: function() {
    console.log("viewModel intialized!")
  },
  // Function to get list of locations.
  getLocations: function() {
    return model.locations;
  },
  // Function to get markers.
  getMarkers: function() {
    return model.markers;
  },
  // Function to return status of hide side panel button.
  getHidePanelButtonStatus: function() {
    return model.hideSidePanelPressed;
  },
  // Function to get bounds from model.
  getBounds: function() {
    return model.mapBounds;
  },
  // Function to update markers in the model
  updateMakers: function(newMarkers) {
    model.markers.push(newMarkers);
  }
};
// initilize scripts.
viewModel.init();
