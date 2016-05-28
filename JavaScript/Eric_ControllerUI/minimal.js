// Global Variables
PHOTOS = new Mongo.Collection("photos");
pref = {
  "steps": [
    "Load Sample",
    "Wash Sample",
    "Load Gold Nanoparticles",
    "Load Silver Enhancement Fluid",
    "Load Index Matching Fluid",
    "Computational Image Analysis"
  ],
  "statuses": [
    "finished",
    "in-progress",
    "queue",
    "failed"
  ],
  "statusMessages": [
    " (Successfully Completed)",
    " (In Progress)",
    "",
    " (Error)"
  ]
};

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', -1);

  Template.photos.helpers({
    standings: function () {
      return PHOTOS.find();
    },
    photo: function () {
      var currStep = Session.get('counter') + 1;
      var currPhoto = PHOTOS.findOne({index: currStep});
      if (currPhoto.found) {
        return currPhoto;
      } else {
        return currPhoto.found;
      }
    }
  });

  Template.photos.events({
    'click .start': function () {
      console.log("Session.get('counter'): " + Session.get('counter'))
      if(Session.get('counter') > pref.steps.length - 1) {
        Session.set('counter', 0);
      } else {
        Session.set('counter', Session.get('counter') + 1);
      }
      updatePhotos(Session.get('counter'), 0, pref);
      updatePhotos(Session.get('counter')+1, 1, pref);
    },
    'click .reset': function () {
      Session.set('counter', -1);
      Meteor.call('reset');
    }
  });
}

function updatePhotos(stepNumber, n, pref) {
  console.log(stepNumber + ' - ' + n + ' - ' + pref.statusMessages[1]);
  var id = PHOTOS.findOne({index: stepNumber});
  if (id) {
    PHOTOS.update(id._id, {
      $set: {
        status: pref.statuses[n],
        statusMessage: pref.statusMessages[n],
      }
    });
  } else {
    console.log('No found ID for ' + stepNumber);
  }
};


if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.call('reset');
  });
}

Meteor.methods({
  'reset': function() {
    // Refresh database
    if (PHOTOS.find().count() > 0) {
      PHOTOS.remove({});
    }
    pref.steps.forEach(function(step, index){
      var stepIdx      = index+1;
      var photoName    = stepIdx + '.jpg';
      var photosOnDisk = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];
      var found        = photosOnDisk.indexOf(photoName) !== -1 ? true : false;
      var status       = pref.statuses[2];
      var statusMes    = pref.statusMessages[2];
      // Insert the curated options
      PHOTOS.insert({
        name: photoName,
        found: found,
        title: 'Step '+stepIdx+': '+step,
        status: status,
        statusMessage: statusMes,
        index: stepIdx
      });
    });
  }
});
