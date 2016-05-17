Meteor.publish("patients", function() {
  return Patients.find({});
});

Meteor.publish("treatmentPlans", function() {
  return TreatmentPlans.find({});
});