Template.adminPanel.helpers({
  Patients: function() {
    Meteor.subscribe('patients');
    Meteor.subscribe('treatmentPlans');
    if (Session.get('doctor')) {
      console.log('Logged in!');
    } else {
      Session.set('doctor', 'asdkjlhfakjlshdf');
    }
    return Patients.find({});
  }
});


Template.adminPanel.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      name: $(e.target).find('[name=name]').val(),
      type: $(e.target).find('[name=type]').val()
    }

    Patients.update(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('doctor');
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this Patient?")) {
      var currentDayId = this._id;
      Patients.remove(currentDayId);
      Router.go('doctor');
    }
  }
});


Template.adminPanel.rendered = function() {
  Meteor.subscribe('patients');
  Meteor.subscribe('treatmentPlans');
};