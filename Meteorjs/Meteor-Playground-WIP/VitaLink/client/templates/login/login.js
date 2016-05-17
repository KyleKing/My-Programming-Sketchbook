Template.login.events({
  'click #patient0' : function(event) {
    // console.log('Clicked Patient 0');
    Session.set('patient', 'xkl23hs0');
    Router.go('patient');
  }
});
Template.login.events({
  'click #patient1' : function(event) {
    // console.log('Clicked Patient 1');
    Session.set('patient', 'xkl23hs1');
    Router.go('patient');
  }
});
Template.login.events({
  'click #patient2' : function(event) {
    // console.log('Clicked Patient 2');
    Session.set('patient', 'xkl23hs2');
    Router.go('patient');
  }
});
Template.login.events({
  'click #doctor' : function(event) {
    // console.log('Clicked Patient 2');
    Session.set('doctor', 'asdkjlhfakjlshdf');
    Router.go('doctor');
  }
});