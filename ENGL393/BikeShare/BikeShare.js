
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

  // Create the Leaflet Map
  Template.map.rendered = function() {
    L.Icon.Default.imagePath = 'leaflet/images';
    var HERE_hybridDayMobile, map;
    if (Meteor.isClient) {
      map = new L.Map('BikeMap', { center: new L.LatLng(38.987701, -76.940989) });
      HERE_hybridDayMobile = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
        attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
        subdomains: '1234',
        mapID: 'newest',
        app_id: 'JIX0epTdHneK1hQlqfkr',
        app_code: 'PchnUPPBcZ5VAuHmovac8g',
        base: 'aerial'
      }).addTo(map);
    }

    // Receive data from server and display on map
    var bikesData = DailyBikeData.find().fetch();
    var i = bikesData.length - 1;
    while (i >= 1) {
      var marker = L.marker([bikesData[i].Positions.lat, bikesData[i].Positions.lng]).addTo(map);
      i--;
    }

    // Display user location
    map.locate({ setView: true }).on("locationfound", function(e) {
      var marker = L.marker([e.latitude, e.longitude]).addTo(map);
    });
  };

}
