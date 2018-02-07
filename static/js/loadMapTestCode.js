<script>
  var map;
  // Create a new blank array for all the listing markers.
  var markers = [];
  var mapCenter = {lat: 42.2683199, lng: -71.8174296};
  var mapZoom = 5;
  function initMap() {
    this.mapElem = document.getElementById('map');
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(this.mapElem, {
      center: mapCenter,
      zoom: mapZoom
    });
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = [
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
    ];
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
      bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
  }
  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
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
</script>
