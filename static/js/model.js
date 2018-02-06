// Models for mover app.
var model = {
  // Create map attributes for map creation
  mapAttributes: [
    // Set map variable to none
    map: null,
    // Set center coordinates for map
    center: {lat: 42.2683199, lng: -71.8174296},
    // Set zoom for map
    zoom: 5
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
