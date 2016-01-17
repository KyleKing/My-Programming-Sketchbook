// Template.patient.rendered = function() {
//   // jQuery(function($){
//   //    $('.drag').drag(function( ev, dd ){
//   //       $( this ).css({ left:dd.offsetX });
//   //    });
//   // });
//   // // Try 2 with UI
//   // $(function() {
//   //   $( "#draggable2" ).draggable({ axis: "x" });
//   // });
//   $(function() {
//     // If drag less than distance
//       $( "#draggable" ).draggable({ revert: true, axis: "x" });
//     // elseif drag past distance
//       // $( "#draggable" ).draggable({ axis: "x" });
//       // Continue pushing off canvs and dissapear
//       // Update mongo to hide from future, record as taken
//     // end
//   });
// };


// Product Demo.Start.Blow Minds({Cinco Suavez});

Template.patient.helpers({
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

Template.patient.dateIS = function (date) {
  return this.date === "Today";
};

Template.patient.events({
  'click .check.meds' : function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      medication: ''
    }

    TreatmentPlans.update(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('patient');
      }
    });
  }
});

Template.patient.events({
  'click .check.sympts' : function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      symptoms: ''
    }

    TreatmentPlans.update(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('patient');
      }
    });
  }
});

Template.patient.events({
  'click .x.meds' : function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      medication: ''
    }

    TreatmentPlans.update(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('patient');
      }
    });
  }
});

Template.patient.events({
  'click .x.sympts' : function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      symptoms: ''
    }

    TreatmentPlans.update(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('patient');
      }
    });
  }
});

Template.patient.helpers({
  patientName: function() {
    Meteor.subscribe('patients');
    if (Session.get('patient')) {
      console.log('Logged in!');
    } else {
      Session.set('patient', 'xkl23hs0');
    }
    var nameValue = Session.get('patient');
    // console.log(Patients.findOne({hash: nameValue}).name);
    return Patients.findOne({hash: nameValue}); // 'Strep'
  }
});

Template.patient.helpers({
  patientComments: function() {
    var nameValue = Session.get('patient');
    // console.log(TPvalue = Patients.findOne({hash: nameValue}));
    return Patients.find({hash: nameValue}); // 'Strep'
  }
});


Template.patient.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentDayId = this._id;

    var dayProperties = {
      comment: $(e.target).find('[name=comment]').val()
    }

    Patients.upsert(currentDayId, {$set: dayProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('patient');
      }
    });
  }
});