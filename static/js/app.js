/* ======= Global Variables ======*/
var map;
var largeInfowindow;
var bounds;
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
    title: 'The Boynton Restaurant & Spirits',
    location: {lat: 42.2708901, lng: -71.8074663}
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
    // Add event listener to toggle bounce animation when marker is clicked.
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
  // Create ko observable boolean for search panel visibility.
  self.showSearchPanel = ko.observable(true);
  // Create KO observable array for locatoins
  self.locationList = ko.observableArray([]);
  // Go through locations array and create a observable array.
  locationsData.forEach(function(location) {
    self.locationList.push({name: location.title});
  });
  // Create ko observable for checking if item is selected.
  self.itemSelected = ko.observable(false);
  // Create ko observable for filter button text.
  self.filterButtonText = ko.observable("Filter");
  // Test observable *Remove after test complete.*
  self.currentProfit = ko.observable(false);

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
  self.filterResetSearch = function() {
    // Check the value of the button.
    if (self.filterButtonText() == "Filter") {
      var listLength = self.locationList().length;
      // Check to see if anything has been entered into the search field.
      if (self.searchLocation() == null) {
        // Alert user that nothing was empty.
        alert("Search field is empty.  Please enter search query.");
      } else {
        // Loop through location list to see if they match your search query.
        for (i = listLength; i > 0; i--) {
          var searchQuery = self.searchLocation().toLowerCase();
          var listLocation = self.locationList()[i -1].name.toLowerCase();
          var markerSearch = markers[i - 1].title.toLowerCase();
          // If search query matches on one of the locations add it to your search array.
          if (listLocation.indexOf(searchQuery) == -1) {
            self.locationList.remove(self.locationList()[i - 1]);
          };
          // Check each marker to see if they match search query.
          if (markerSearch.indexOf(searchQuery) == -1) {
            markers[i - 1].setMap(null);
          }
        };
        // hide filter button
        self.filterButtonText("Reset")
      }
    } else {
      // Empty location list.
      self.locationList([]);
      // Re add items to locations list array.
      locationsData.forEach(function(location) {
        self.locationList.push({name: location.title});
      });
      self.filterButtonText("Filter")
      self.searchLocation(null);
      // Add markers back to map.
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      // Reset the bounds
      map.fitBounds(bounds);
    }
  };
  // Select marker function
  self.selectMarker = function() {
    console.log("Clicked!");
    console.log(self.locationList().name);
    self.currentProfit(true);
    self.itemSelected(true);
  };

  /*==== Google maps functions ====*/

  // Function to add info windows.
  function populateInfoWindow(marker, infowindow) {
    var locationPictureSearch = locationsData[0].title;
    var latLng = locationsData[0].location.lat + "," + locationsData[0].location.lng;
    var fourSquareClientId = "KNCUUURDLALARYLELMI4ZNRGOLPX44XYMPCOWRTWWOVDN4WA";
    var fourSquareClientSecret = "YOEN04J05A1VH4JIGUBUGSWOGYMOEK4PGIOEXHRSA43VSIAC";
    var fourSquareUrl =
      ("https://api.foursquare.com/v2/venues/search?limit=1&query=" + "&" +
      locationPictureSearch + "&near=" + latLng + "&client_id=" +
      fourSquareClientId + "&client_secret=" + fourSquareClientSecret +
      "&v=20180212")
    var fourSquarePictureUrl = ("https://api.foursquare.com/v2/venues/")

    var venueID;
    // Ajax request to get venue ID. This will be used to get a photo.
    $.getJSON(fourSquareUrl, function(data) {
      venueID = data.response.venues[0].id;
      var fourSquarePictureUrl = (fourSquarePictureUrl + venueID +
        "photos?limit=1" + "&client_id=" + fourSquareClientId +
        "&client_secret=" + fourSquareClientSecret +"&v=20180212")
        console.log(fourSquarePictureUrl);
        // Insert second ajax request here.
    });
    console.log(venueID);


    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function() {
        infowindow.marker = null;
        marker.setAnimation(null);
      });
      // This function gets the street view panaorma of each marker and adds
      // it to the infowinow.
      function getFlickrPicture(data, status) {
        var fourSquareUrl = ("https://api.foursquare.com/v2/venues/search?limit=1&query=" + location + "&near=" + latLng)
        // Check status.
        if (status == google.maps.StreetViewStatus.OK) {
          // Get the lat long
          var nearStreetViewLocation = data.location.latLng;
          // Calculate the header us the comput heading function.
          infowindow.setContent('<div>' + marker.title + '</div><div id="streetImage"></div>');

          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('streetImage'), panoramaOptions);
        } else {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Photo Found</div>');
        }
      }
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }
  // Function for toggle the bounce animation for any marker that is clicked.
  function toggleBounce(marker) {
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      // Check to see if any other markers are bouncing and remove bounce animation.
      for (i = 0; i < markers.length; i++) {
        if (markers[i].animating == true) {
          markers[i].setAnimation(null);
        }
      }
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  };
};
