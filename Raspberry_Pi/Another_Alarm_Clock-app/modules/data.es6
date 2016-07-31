// Load all images from photos folder to match with known list of steps:
const Datastore = require('nedb');
const fs = require('fs-extra');
const moment = require('moment');

const pref = [1, 2, 3, 4, 5, 6];

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
  const uniq = moment().format('YYYY_DDDD_kk_mm_ss_');
  return uniq;
}

const schedule = '* * * * * *';
// const uniq = randCron();
// console.log(uniq);
// scheduleCron(uniq, schedule);

const crons = new Datastore({
  filename: '../data/crons',
  autoload: true,
});

pref.forEach((step, index) => {
  const stepIdx = index + 1;
  crons.insert({
    uniq: randCron(),
    title: 'ALARM!',
    schedule,
    status: 'queue',
    saved: false,
    started: true,
    index: stepIdx,
  });
});

module.exports = {
  alarms: crons,
};
