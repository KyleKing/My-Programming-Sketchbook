Template.doctorView.helpers({
  templatePlanItem: function() {
    Meteor.subscribe('patients');
    Meteor.subscribe('treatmentPlans');
    if (Session.get('patient')) {
      console.log('Logged in!');
    } else {
      Session.set('patient', 'xkl23hs0');
    }
    var nameValue = Session.get('patient');
    var TPvalue = Patients.findOne({hash: nameValue}); // 'Strep'
    return TreatmentPlans.find({type: TPvalue.type});
  }
});

Template.doctorView.helpers({
  patientName: function() {
    Meteor.subscribe('patients');
    var nameValue = Session.get('patient');
    console.log(Patients.findOne({hash: nameValue}).name);
    return Patients.findOne({hash: nameValue}); // 'Strep'
  }
});