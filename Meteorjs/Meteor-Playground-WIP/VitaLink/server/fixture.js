// Fixture data
if (TreatmentPlans.find().count() === 0) {
  var tmp = '';
  var i = 0;
  var tmpCheckIn = '';
  var date = [];
  var checkIn = [1, 4, 4, 4, 4, 0, 0];
  var update = [];

  for (i = 0; i < 7; i++) {
    tmp = moment().add(i, 'd')
    tmpCheckIn = moment().add(checkIn[i], 'd').from(tmp);
    if (tmpCheckIn === 'a few seconds ago') {
      update[i] = "by tonight";
    } else {
      update[i] = tmpCheckIn;
    }
    // console.log(update[i]);
    tmp = tmp.fromNow();
    if (tmp === 'a few seconds ago') {
      date[i] = "Today";
    } else if (tmp === 'in a day') {
      date[i] = "Tomorrow";
    } else {
      date[i] = moment().add(i, 'd').format("dddd");
    }
    // console.log(date[i]);
  };

  var alertMessage = ['You will be contagious for the next 24 hours', '', '', '', '', '', ''];
  var medAmount = [2];
  var medType = ['Amoxicilin'];
  var medTime = ['night'];
  var symptoms = ['sore throat and grogginess fade', 'sore throat and grogginess fade', 'sore throat and grogginess fade', 'sore throat and grogginess fade', 'sore throat and grogginess fade', 'minor grogginess', 'fully healthy'];

  for (i = 0; i < 7; i++) {
    TreatmentPlans.insert({
      type: 'Strep',
      date: date[i],
      alert: alertMessage[i],
      medicationAmt: medAmount[0],
      medication: medType[0],
      medicationTime: medTime[0],
      symptoms: symptoms[i],
      sympTime: update[i]
    });
  };
// Break
  var tmp = '';
  var i = 0;
  var tmpCheckIn = '';
  var date = [];
  var checkIn = [1, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  var update = [];

  for (i = 0; i < 11; i++) {
    tmp = moment().add(i, 'd')
    tmpCheckIn = moment().add(checkIn[i], 'd').from(tmp);
    if (tmpCheckIn === 'a few seconds ago') {
      update[i] = "by tonight";
    } else {
      update[i] = tmpCheckIn;
    }
    // console.log(update[i]);
    tmp = tmp.fromNow();
    if (tmp === 'a few seconds ago') {
      date[i] = "Today";
    } else if (tmp === 'in a day') {
      date[i] = "Tomorrow";
    } else {
      date[i] = moment().add(i, 'd').format("dddd");
    }
    // console.log(date[i]);
  };

  var alertMessage = ['You will be contagious for the next 24 hours', 'You will be contagious for the next 24 hours', 'You will be contagious for the next 24 hours', 'You will be contagious for the next 24 hours', 'You will be contagious for the next 24 hours', '', '', '', '', '', ''];
  var medAmount = [3];
  var medType = ['Penicilin'];
  var medTime = ['night'];
  var symptoms = ['sore throat and grogginess fade', 'sore throat and grogginess fade', 'sore throat and grogginess fade', 'sore throat and grogginess fade', 'sore throat and grogginess fade', 'minor grogginess', 'minor grogginess', 'minor grogginess', 'minor grogginess', 'minor grogginess', 'fully healthy'];

  for (i = 0; i < 11; i++) {
    TreatmentPlans.insert({
      type: 'Tonsilitis',
      date: date[i],
      alert: alertMessage[i],
      medicationAmt: medAmount[0],
      medication: medType[0],
      medicationTime: medTime[0],
      symptoms: symptoms[i],
      sympTime: update[i]
    });
  };
// Break
  TreatmentPlans.insert({
    type: 'StayHealthy',
    date: date[1],
    symptoms: 'Work on your tennis swing and play more basketball'
  });
};



// Fixture data
if (Patients.find().count() === 0) {
  Patients.insert({
    hash: 'xkl23hs0',
    name: 'Kylie',
    type: 'Tonsilitis'
  });
  Patients.insert({
    hash: 'xkl23hs1',
    name: 'Dr. Bailey',
    type: 'Strep'
  });
  Patients.insert({
    hash: 'xkl23hs2',
    name: 'Suarez',
    type: 'StayHealthy'
  });
};