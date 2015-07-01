DailyBikeData = new Mongo.Collection('dailyBikeData');

if (Meteor.isServer) {
  // Create Bike GPS coordinates
  function randGPS() {
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    var accuracy = 1000000; // To account for the integer based rand function
    var bottomLng = -76.936569; var topLng = -76.950603;
    var leftLat = 38.994052; var rightLat = 38.981376;
    var randCoordinates = {
      lat: (getRandomArbitrary(leftLat * accuracy, rightLat * accuracy) / accuracy),
      lng: (getRandomArbitrary(bottomLng * accuracy, topLng * accuracy) / accuracy)
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
  Template.table.helpers({
    bikeInfo: function () {
      return DailyBikeData.find();
    }
  });
}










