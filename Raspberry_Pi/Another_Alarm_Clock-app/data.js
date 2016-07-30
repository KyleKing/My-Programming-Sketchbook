// Load all images from photos folder to match with known list of steps:
var Datastore = require('nedb');
var fs = require('fs-extra');
var moment = require('moment');

var pref = [1, 2, 3, 4, 5, 6];

// ---- Cron Alarms - lots of issues for now!

function scheduleCron(cronID, cronSchedule) {
	console.log(cronID);
	console.log(cronSchedule);
  // ClockAlarms.demo = new CronJob('0 0 6 * * 1-5', () => {
  // ClockAlarms[cronID] = new CronJob(cronSchedule, () => {
  //   console.log('Starting Alarm!');
  //   updateClockDisplay('[ALARM!] \n h:mm:ss a');
  //   console.log('ALARM!');
  // }, () => {
  //   console.log('Finished running alarm');
  // }, false);
}

function randCron() {
	var randVal = Math.floor(Math.random()*(20));
	var uniq = moment().format('YYYY_DDDD_kk_mm_ss_' + randVal);
	return uniq
}

var schedule = '* * * * * *';
// var uniq = randCron();
// console.log(uniq);
// scheduleCron(uniq, schedule);

var crons = new Datastore({
	filename: __dirname + '/data/crons',
	autoload: true
});

pref.forEach(function(step, index) {
	var stepIdx = index + 1;
	crons.insert({
		uniq: randCron(),
		title: 'ALARM!',
		schedule: schedule,
		status: "queue",
		saved: false,
		started: true,
		index: stepIdx
	});
});

module.exports = {
	alarms: crons
};
