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

    function initMap() {
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
      };
    };
    // Call creat Markers function
    this.createMarkers(locations);
  };
};
