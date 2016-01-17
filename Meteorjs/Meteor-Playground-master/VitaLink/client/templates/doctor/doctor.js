Template.doctor.helpers({
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

Template.doctor.events({
  'click #patient0' : function(event) {
    // console.log('Clicked Patient 0');
    Session.set('patient', 'xkl23hs0');
    Router.go('doctorView');
  }
});
Template.doctor.events({
  'click #patient1' : function(event) {
    // console.log('Clicked Patient 1');
    Session.set('patient', 'xkl23hs1');
    Router.go('doctorView');
  }
});
Template.doctor.events({
  'click #patient2' : function(event) {
    // console.log('Clicked Patient 2');
    Session.set('patient', 'xkl23hs2');
    Router.go('doctorView');
  }
});
Template.doctor.events({
  'click #doctor' : function(event) {
    // console.log('Clicked Patient 2');
    Session.set('doctor', 'asdkjlhfakjlshdf');
    Router.go('adminPanel');
  }
});