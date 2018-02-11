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
    title: 'Armsby Abbey',
    location: {lat: 42.2687583, lng: -71.8007635}
  },
  {
    title: 'Wormtown Brewery',
    location: {lat: 42.2634965, lng: -71.7912016}
  }
]


/* ======= ViewModel ======= */
var viewModel = function() {
  console.log("The bindings have binded!");

  /*==== Variables ====*/

  var self = this;
  var markers = [];

  /*==== Create Markers ====*/

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
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('click', function() {
      toggleBounce(this, marker);
    });
    // Push the markers to the map.
    markers.push(marker);
    // Extend the bounds with each marker.
    bounds.extend(markers[i].position);
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
  // Create ko observable array for locations searched for.
  self.searchList = ko.observableArray([]);
  // Create ko observable boolean for search panel visibility.
  self.showSearchPanel = ko.observable(true);
  // Create ko observable for showing Filter search button.
  self.showFilterButton = ko.observable(true);
  // Create ko observable for showing reset button.
  self.showRestButton = ko.observable(false);
  // Create ko observable for showing full location list.
  self.showLocationList = ko.observable(true);
  // Create ko observable for showing search list.
  self.showSearchResultList = ko.observable(false);
  // Create KO observable array for locatoins
  self.locationList = ko.observableArray([]);
  // Go through locations array and create a observable array.
  locationsData.forEach(function(location) {
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
    // Create var to keep length of location list.
    var listLength = self.locationList().length;
    // Check to see if anything has been entered into the search field.
    if (self.searchLocation() == null) {
      // Alert user that nothing was empty.
      alert("Search field is empty.  Please enter search query.");
    } else {
      // Loop through location list to see if they match your search query.
      for (i = 0; i < listLength; i++) {
        var searchQuery = self.searchLocation().toLowerCase();
        var listLocation = self.locationList()[i].name.toLowerCase();
        // If search query matches on one of the locations add it to your search array.
        if (listLocation.indexOf(searchQuery) != -1) {
          self.searchList.push(self.locationList()[i]);
        };
      };
      // hide filter button
      self.showFilterButton(false);
      // show reset button
      self.showRestButton(true);
      // hide location list
      self.showLocationList(false);
      // show search results list
      self.showSearchResultList(true);
    }
  };
  // Rest search function
  self.resetSearch = function() {
    self.showFilterButton(true);
    self.showRestButton(false);
    self.showLocationList(true);
    self.showSearchResultList(false);
    self.searchList([]);
    self.searchLocation(null);
  };
  // Select marker function
  self.selectMarker = function() {
    console.log("Clicked!");
  };

  /*==== functions ====*/

  // Function to add info windows.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function() {
        infowindow.setMarker = null;
      });
    }
  };
  function toggleBounce(marker) {
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      for (i = 0; i < markers.length; i++) {
        if (markers[i].animating == true) {
          markers[i].setAnimation(null);
        }
      }
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  };
};
