
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
    while (i <= 50) {
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
    map.spin(true);

    // Receive data from server and display on map and rerun on server updates
    Meteor.autorun(function() {
      var bikesData = DailyBikeData.find().fetch();
      bikesData.forEach(function(bike) {
        var latlng = [bike.Positions.lat, bike.Positions.lng];
        var marker = L.marker(latlng).addTo(map);
        marker.bindPopup("#" + bike.Bike + " is " + bike.Tag);
      });
    });


    // // // Source: http://meteorcapture.com/how-to-create-a-reactive-google-map/
    // DailyBikeData.find().observe({
    //   added: function(document) {
    //     console.log(document);
    //     // var latlng = [bike.Positions.lat, bike.Positions.lng];
    //     // var marker = L.marker(latlng).addTo(map);
    //     // marker.bindPopup("#" + bike.Bike + " is " + bike.Tag);


    //     // // Create a marker for this document
    //     // var marker = new google.maps.Marker({
    //     //   draggable: true,
    //     //   animation: google.maps.Animation.DROP,
    //     //   position: new google.maps.LatLng(document.lat, document.lng),
    //     //   map: map.instance,
    //     //   // We store the document _id on the marker in order
    //     //   // to update the document within the 'dragend' event below.
    //     //   id: document._id
    //     // });

    //     // // This listener lets us drag markers on the map and update their corresponding document.
    //     // google.maps.event.addListener(marker, 'dragend', function(event) {
    //     //   Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
    //     // });

    //     // // Store this marker instance within the markers object.
    //     // markers[document._id] = marker;
    //   },
    //   // // changed: function(newDocument, oldDocument) {
    //   // //   markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
    //   // // },
    //   // removed: function(oldDocument) {
    //   //   // Remove the marker from the map
    //   //   markers[oldDocument._id].setMap(null);

    //   //   // Clear the event listener
    //   //   google.maps.event.clearInstanceListeners(
    //   //     markers[oldDocument._id]);

    //   //   // Remove the reference to this marker instance
    //   //   delete markers[oldDocument._id];
    //   // }
    // });
    // // Similar Alt: http://asynchrotron.com/blog/2013/12/28/realtime-maps-with-meteor-and-leaflet-part-2/
    // //
    // // Packages? https://atmospherejs.com/?q=leaflet


    var bottomLng = -76.936569; var topLng = -76.950603;
    var leftLat = 38.994052; var rightLat = 38.981376;

    var polygon = L.polygon([
      [rightLat, bottomLng],
      [rightLat, topLng],
      [leftLat, topLng],
      [leftLat, bottomLng]
    ]).addTo(map);

    // Zoom to user location
    map.locate({ setView: true })

    // Notes for using included MarkCluster Package
    // var markers = new L.MarkerClusterGroup();
    // markers.addLayer(new L.Marker([51.5, -0.09]));
    // map.addLayer(markers);
  };
}
