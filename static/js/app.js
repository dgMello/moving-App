/* ======= Global Variables ======*/
var map;
var largeInfowindow;
var bounds;

/* ======= Google Map ======= */

// Function to initilize map.
function initMap() {
  // Create mapElem
  this.mapElem = document.getElementById("map");
  // Create initial infowdinow variable
  largeInfowindow = new google.maps.InfoWindow();
  // Create initial bounds variable
  bounds = new google.maps.LatLngBounds();
  markers = [];
  map = new google.maps.Map(this.mapElem, {
    center: {lat: 42.2683199, lng: -71.8174296},
    zoom: 13
  });

  ko.applyBindings(new viewModel());
}

// Function that runs when their is an error loading the map.
function googleError() {
  document.getElementByTagName("body").innerHTML = "Error loading map.";
}

/* ======= ViewModel ======= */
var viewModel = function() {

  /*==== Variables ====*/

  var self = this;
  var markers = [];

  /*==== ko observables ====*/

  // Create ko observable boolean for search panel visibility.
  self.showSearchPanel = ko.observable(true);
  // Create KO observable array for locatoins
  self.locationList = ko.observableArray([]);
  // Go through locations array and create a observable array.
  locationsData.forEach(function(location) {
    self.locationList.push({name: location.title, id: location.id,
      marker: location.marker, visible: location.visible});
  });
  // Create ko observable for checking if item is selected.
  self.itemSelected = ko.observable(false);
  // Create ko observable for filter button text.
  self.searchPaneButtonTitle = ko.observable("Hide Search Pane");
  // Create ko obervable for filter button.


  /*==== Create Markers ====*/

 // Create markers function.  This will be run through a loop to create the markers.
  function createMarkers(i) {
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
    // Create onlick event for your marker to change animation, open infowindow and hightlight list item.
    marker.addListener("click", function() {
      populateInfoWindow(this, largeInfowindow);
      toggleBounce(this);
    });
    // Push the markers to the map.
    self.locationList()[i].marker = marker;
    // Push the markers to the map.
    // Extend the bounds with each marker.
    bounds.extend(self.locationList()[i].marker.position);
  }
  // Loop to create markers.
  for (var i = 0; i < self.locationList().length; i++) {
    createMarkers(i);
  }
  // Fit the bounds.
  map.fitBounds(bounds);

  /*==== KO Functions ====*/

  // Toggle pane function
  self.toggleSearchPane = function() {
    if (self.showSearchPanel()) {
      self.showSearchPanel(false);
      self.searchPaneButtonTitle("Show Search Pane");
    } else {
      self.showSearchPanel(true);
      self.searchPaneButtonTitle("Hide Search Pane");
    }
  };
  // Create KO observable search for holding search items.
  self.searchLocation = ko.observable('');
  // Use ko pureComputed to filter your search array.
  self.filterSearch = ko.pureComputed(function() {
    return ko.utils.arrayFilter(self.locationList(), function(location) {
      // Filter markers based on search query.
      if (location.marker.title.toLowerCase().indexOf(self.searchLocation().toLowerCase()) == -1) {
        location.marker.setMap(null);
      } else {
        location.marker.setMap(map);
      }
      return location.name.toLowerCase().indexOf(self.searchLocation().toLowerCase()) >= 0;
    });
  });
  // Select marker function
  self.listItemSelected = function(location) {
    // Set all list items to background color black.
    $("li.locationListItems").css("background-color", "black");
    // Set the selected list item to the color grey.
    $("#" + location.id).css("background-color", "grey");
    // Run toggle bounce and poplulate info window on the correlating marker.
    populateInfoWindow(location.marker, largeInfowindow);
    toggleBounce(location.marker, largeInfowindow);
  };

  /*==== Google maps functions ====*/

  // Function to add info windows.
    function populateInfoWindow(marker, infowindow) {
      // This function gets the street view panaorma of each marker and adds
      // it to the infowinow.
      function getFoursqurePicture(marker) {
        // Get Location title fropm clicked marker.
        var locationPictureSearch = marker.title;
        // Get Location latlng fropm clicked marker.
        var latLng = marker.position.lat() + "," + marker.position.lng();
        var fourSquareClientId = "KNCUUURDLALARYLELMI4ZNRGOLPX44XYMPCOWRTWWOVDN4WA";
        var fourSquareClientSecret = "YOEN04J05A1VH4JIGUBUGSWOGYMOEK4PGIOEXHRSA43VSIAC";
        // Create foursqure url to send.
        var fourSquareUrl = (`https://api.foursquare.com/v2/venues/search?limit=1&query=&
          ${locationPictureSearch} &near= ${latLng} &client_id=
          ${fourSquareClientId} &client_secret= ${fourSquareClientSecret}
          &v=20180212`);
        // Ajax request to get venue ID. This will be used to get a photo.
        $.getJSON(fourSquareUrl)
          // Function run if ajax request succeeds searching for venue ID.
          .done(function(data) {
            // Check that the repsonse from sever is OK.
            if (data.meta.code == 200) {
              // Check that server found any matches to your GET request.
              if (data.response.venues.length > 0) {
                // Get the venue ID from the response.
                var venueID = data.response.venues[0].id;
                // Create new URL for the photo request.
                var fourSquarePictureUrl = (`https://api.foursquare.com/v2/venues/`+
                  `${venueID}/photos?limit=1&client_id=${fourSquareClientId}` +
                  `&client_secret=${fourSquareClientSecret}&v=20180212`);
                  // Second ajax will use Venue ID from first ajax request to get pictures.
                  $.getJSON(fourSquarePictureUrl)
                    // Function run if ajax request succeeds searching for venue photo.
                    .done(function(data) {
                      // Check that 200 code was received.
                      if (data.meta.code == 200) {
                        // Check to see if any photos were returned from server
                        if (data.response.photos.count > 0) {
                          // Get the photo array.
                          var photoData = data.response.photos.items[0];
                          // Get the prefix of the photo url.
                          var urlPrefix = photoData.prefix;
                          // Get the suffix of the photo url.
                          var urlSuffix = photoData.suffix;
                          // crete the photo uRL using the prefix, suffix and adding a picture size.
                          var photoURL = (urlPrefix + "150x150" + urlSuffix);
                          // Add the photo to the infowindow alowng with title.
                          infowindow.setContent("<div><p id='infoWindowTitle'>" +
                            marker.title + "</p></div>" + "<div><img id='infoWindowPhoto' src='" +
                            photoURL +"'></div><div>Photo from Foursquare");
                        } else {
                          // If no photos are found inform user.
                          infowindow.setContent("<div class='infoWindow'>" +
                            marker.title + "</div>" + "<div>No Photo Found.</div>");
                        }
                      } else {
                        // Provide the error code to the user if there is an error contacting the server.
                        infowindow.setContent("<div>" + marker.title + "</div>" +
                          "<div>Error Retrieving Venue Photo. Error code: " +
                          data.meta.code + "</div>");
                      }
                    })
                    // Function run if ajax request fails searching for venue photo.
                    .fail(function() {
                      infowindow.setContent("<div>" + marker.title + "</div>" +
                        "<div>Ajax Error retreiving venue photo.</div>");
                    });
              } else {
              // If no venue is found at location inform user.
                infowindow.setContent("<div>" + marker.title + "</div>" +
                  "<div>Venue cannot be found on Foursquare.</div>");
              }
            } else {
              // Provide the error code to the user if there is an error contacting the server.
              infowindow.setContent("<div>" + marker.title + "</div>" +
                "<div>Error Retrieving Venue ID. Error code: " + data.meta.code +
                "</div>");
            }
          })
          // Function run if ajax request fails searching for venue ID.
          .fail(function() {
            infowindow.setContent("<div>" + marker.title + "</div>" +
              "<div>Ajax Error retreiving venue ID.</div>");
          });
      }
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        infowindow.setContent("");
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener("closeclick",function() {
          infowindow.marker = null;
          marker.setAnimation(null);
        });
        getFoursqurePicture(marker);
      }
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
  // Function for toggle the bounce animation for any marker that is clicked.
  function toggleBounce(marker, infowindow) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      for (var i = 0; i < self.locationList().length; i++) {
        if (self.locationList()[i].marker.animating === true) {
          self.locationList()[i].marker.setAnimation(null);
        }
      }
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
};
