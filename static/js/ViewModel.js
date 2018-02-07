/* ======= Google Map ======= */
var map;
// Function to initilize map.
function initMap() {
  this.mapElem = document.getElementById('map');
  markers = viewModel.getMarkers();
  map = new google.maps.Map(this.mapElem, {
    center: {lat: 42.2683199, lng: -71.8174296},
    zoom: 13
  });
};

/* ======= Model ======= */

/* ======= ViewModel ======= */

var viewModel = {
  // Function to initilize app
  init: function() {
    console.log("viewModel intialized!")
    mapView.init();
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
  // Function to get info winow from model.
  getInfoWindow: function() {
    return model.largeInfowindow;
  },
  // Function to get bounds from model.
  getBounds: function() {
    return model.mapBounds;
  },
  // Function to change the status of hide panel button
  switchHidePanelButtonStatus: function(buttonStatus) {
    if (buttonStatus) {
      model.hideSidePanelPressed = false;
    }
    else {
      model.hideSidePanelPressed = true;
    }
  },
  updateMarkers: function(newMarkers) {

  }
};

/* ======= View ======= */

// initilize scripts.
viewModel.init();
