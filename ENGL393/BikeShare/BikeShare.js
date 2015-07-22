
// Version 2

DailyBikeData = new Mongo.Collection('dailyBikeData');

if (Meteor.isServer) {
  // Create Bike GPS coordinates
  function randGPS() {
    // Set bounding constraints
    var bottomLng = -76.936569; var topLng = -76.950603;
    var leftLat = 38.994052; var rightLat = 38.981376;
    var TypeConvFactor = 1000000; // To account for the int based getRandomArbitrary function

    // Create random coordinates
    function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }
    var randCoordinates = {
      lat: (getRandomArbitrary(leftLat*TypeConvFactor, rightLat*TypeConvFactor) / TypeConvFactor),
      lng: (getRandomArbitrary(bottomLng*TypeConvFactor, topLng*TypeConvFactor) / TypeConvFactor)
    };
    return randCoordinates;
  };

  // Insert data into the database
  if (DailyBikeData.find().count() === 0) {
    var i = 1;
    while (i <= 2) {
      var randCoordinates = randGPS();
      DailyBikeData.insert({
        Bike: i,
        Tag: Math.round(0.65 * Math.random()) === 0 ? 'Available' : 'In Use',
        Positions: {
          lat: randCoordinates.lat,
          lng: randCoordinates.lng
        }
      });
      i++;
    }
    console.log('Created DailyBikeData data schema');
  }
}


if (Meteor.isClient) {
  // Create Spacebars helper to load bike data into a table
  Template.table.helpers({
    bikeInfo: function () {
      return DailyBikeData.find();
    }
  });
}


// Version 3

if (Meteor.isClient) {
  Template.map.rendered = function() {
    // Create the Leaflet Map
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
    var map = new L.Map('BikeMap', { center: new L.LatLng(38.987701, -76.940989) });
    L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
    map.spin(false);

    // // Receive data from server and display on map and rerun on server updates
    // Meteor.autorun(function() {
    //   var bikesData = DailyBikeData.find().fetch();
    //   bikesData.forEach(function(bike) {
    //     var latlng = [bike.Positions.lat, bike.Positions.lng];
    //     var marker = L.marker(latlng).addTo(map);
    //     marker.bindPopup("#" + bike.Bike + " is " + bike.Tag);
    //   });
    // });

    // Source: http://meteorcapture.com/how-to-create-a-reactive-google-map/
    // and leaflet specific: http://asynchrotron.com/blog/2013/12/28/realtime-maps-with-meteor-and-leaflet-part-2/
    var markers = [];
    DailyBikeData.find({}).observe({
      added: function(bike) {
        var latlng = [bike.Positions.lat, bike.Positions.lng];
        var marker = L.marker(latlng,
            {title: "#" + bike.Bike + " is " + bike.Tag,
            opacity: 0.5} // Adjust the opacity
            ).addTo(map);
        // marker.bindPopup("#" + bike.Bike + " is " + bike.Tag);

        // Store this marker instance within the markers object.
        markers[bike._id] = marker;

        console.log(markers[bike._id] + ' added to map on ADDED event');
      },
      changed: function(bike, oldDocument) {
        var latlng = [bike.Positions.lat, bike.Positions.lng];
        markers[bike._id].setLatLng(latlng).update();

        console.log(markers[bike._id] + ' changed on map on CHANGED event');
      },
      removed: function(oldBike) {
        console.log(oldBike);
        // Remove the marker from the map
        map.removeLayer(markers[oldBike._id]);

        // Remove the reference to this marker instance
        delete markers[oldBike._id];

        console.log(markers[oldBike._id] + ' removed from map on REMOVED event');
      }
    });

    var bottomLng = -76.936569; var topLng = -76.950603;
    var leftLat = 38.994052; var rightLat = 38.981376;

    var polygon = L.polygon([
      [rightLat, bottomLng],
      [rightLat, topLng],
      [leftLat, topLng],
      [leftLat, bottomLng]
    ]).addTo(map);

    // // Zoom to user location
    // map.locate({ setView: true })
    map.setView(new L.LatLng(38.987701, -76.940989), 13);

    // Notes for using included MarkCluster Package
    // var markers = new L.MarkerClusterGroup();
    // markers.addLayer(new L.Marker([51.5, -0.09]));
    // map.addLayer(markers);
  };
}
