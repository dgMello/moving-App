// Variable containing functions for creating the search panel view
var searchPanelView = {
};
// Variable containng functions for creating map view.
var mapView = {
  // init function that will initilize the map view part of the DOM.
  init: function() {
    console.log("mapView intialized!")
    this.mapElem = document.getElementById('map');
    // Render the dom using the render function
    this.render();
  },
  // Render function that will create and markers.
  render: function() {
    // Create array of locatons using the viewmodel function getLocations
    var locations = viewModel.getLocations();
    // Call creat Markers function
    this.createMarkers(locations);
    console.log("mapView rendered!")
  },
  // Function to create markers.
  createMarkers: function() {
    markers = viewModel.getMarkers();
    console.log(markers);
    locations = viewModel.getLocations();
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      markers.push({map: this.mapElem, postion: position, title: title,
        animation: google.maps.Animation.DROP, id: i});
      console.log(markers);

    }
  }
};
