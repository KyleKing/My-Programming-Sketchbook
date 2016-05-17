if (Meteor.isClient) {

  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.pics.helpers({
    counter: function () {
      return Session.get("counter");
      Cordova.beep(6);
      cordova.vibrate(10);
    }
  });

  Template.pics.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}