Template.edit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      date: $(e.target).find('[name=date]').val(),
      alert: $(e.target).find('[name=alert]').val(),
      medication: $(e.target).find('[name=medication]').val(),
      medicationAmt: $(e.target).find('[name=medicationAmt]').val(),
      medicationTime: $(e.target).find('[name=medicationTime]').val(),
      symptoms: $(e.target).find('[name=symptoms]').val(),
      sympTime: $(e.target).find('[name=sympTime]').val()
    }

    TreatmentPlans.update(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('doctorView');
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this day?")) {
      var currentDayId = this._id;
      TreatmentPlans.remove(currentDayId);
      Router.go('doctorView');
    }
  }
});


Template.edit.rendered = function() {
  Meteor.subscribe('patients');
  Meteor.subscribe('treatmentPlans');
};