/* ======= model ======= */
// Models for mover app.
var model = {
  // Create map attributes for map creation
  mapAttributes: [
    {
      // Set map variable to none
      map: null,
      // Set center coordinates for map
      center: {lat: 42.2683199, lng: -71.8174296},
      // Set zoom for map
      zoom: 5
    }
  ],
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
  ],
  // Create larginfo window data point
  largeInfowindow: null,
  // Create mapsBounds data point.
  mapBounds: null,
  // model for keeping tracking of when the hide panel button is pressed.
  hideSidePanelPressed: false
};



/* ======= ViewModel ======= */

var viewModel = {
  // Function to initilize app
  init: function() {
    mapView.init;
  },
  // Function to get map Variable and starting attributes
  getMap: function() {
    return model.mapAttributes;
  },
  // Function to get list of locations.
  getLocations: function() {
    return model.locations;
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
  }
};

/* ======= View ======= */
// Variable containing functions for creating the search panel view
var searchPanelView = {
};
// Variable containng functions for creating map view.
var mapView = {
  // init function that will initilize the map view part of the DOM.
  init: function() {
    this.mapElem = document.getElementById('map');
    // Render the dom using the render function
    this.render();
  },
  // Render function that will create and markers.
  render: function() {
    // Create array of locatons using the viewmodel function getLocations
    var locations = ViewModel.getLocations;
    // Call creat Markers function
    this.initMap();
    // this.createMarkers(locations);
  },
  // Function to create map with zoom and center attributes.
  initMap: function() {
    // Call get map from viewModel to get map mapAttributes
    mapInfo = ViewModel.getMap;
    // Assign map to null
    map = mapInfo.map;
    // Create mapCenter variable to hold center variable.
    mapCenter = mapInfo.mapCenter;
    // Create mapZoom variable to hold zoom variale.
    mapZoom = mapInfo.zoom;
    // Create map
    map = new google.maps.Map(this.mapElem, {
      center: mapCenter,
      zoom: mapZoom
    });
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        map: this.mapElem,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      markers.push(marker);
    }
  }
};

// initilize scripts.
viewModel.init();
