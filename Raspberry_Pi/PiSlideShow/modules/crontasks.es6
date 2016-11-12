/* initialize debugger */
import { warn, init } from './debugger.es6';
const cronDebug = init('cron');

const photoframe = require('./photoframe.es6');
const PythonShell = require('python-shell');
const CronJob = require('cron').CronJob;

// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12
// day of week    0-6 (Sun-Sat)

// ##########################################################
//    Setup the on/off cycles of the TFT display
// ##########################################################

const pyshell = new PythonShell('py_scripts/sys_actions.py');
pyshell.on('message', (message) => { cronDebug(`(sys_actions.py) Received: ${message}`); });
pyshell.on('error', (err) => { throw err; });
pyshell.on('close', (err) => {
  if (err)
    throw err;
  console.log('Finished and closed (sys_actions.py)');
});

function controlDisplay(schedule, sentText, task) {
  const JOB = new CronJob(schedule, () => {
    cronDebug(`Starting ${task}`);
    pyshell.send(sentText);
  }, () => {
    console.log(warn(`!! Completed ${task} Cron Task !!`));
  }, false);
  return JOB;
}

// Turn the display on when people should be around
const WeekEndMorningOn = controlDisplay('0 0 8 * * 0,6', 'tft true', 'ActivateDisplay');
const WeekDayMorningOn = controlDisplay('0 15 5 * * 1-5', 'tft true', 'ActivateDisplay');
const WeekDayMorningOff = controlDisplay('0 30 6 * * 1-5', 'tft false', 'ActivateDisplay');
const WeekDayAfternnOn = controlDisplay('0 30 16 * * 1-5', 'tft true', 'ActivateDisplay');
const SleepDisplay = controlDisplay('0 30 21 * * *', 'tft false', 'SleepDisplay');

// ##########################################################
//    Keep Local Images Directory in Sync
// ##########################################################

// Check for new photos as often as possible:
const dbCloudDir = 'Apps/Balloon.io/aloo';
// // const Fetch = new CronJob('0 0,10,20,30,40,50 * * * *', () => {
// const Fetch = new CronJob('0 5,35 * * * *', () => {
//   cronDebug('Fetching Photos');
//   photoframe.downloadPhotos(dbCloudDir, refreshDisplay);
// }, () => {
//   console.log(warn('!! Completed Fetch Cron Task !!'));
// }, false);

// Since FBI task doesn't loop correctly, keep refreshing it:
// const FBI = new CronJob('0 00,05,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
const FBI = new CronJob('0 0,10,20,30,40,50 8-21 * * *', () => {
  cronDebug('Refreshing FBI Task');
  pyshell.send('fbi killoldfbi');
}, () => {
  console.log(warn('!! Completed Refresh FBI Task !!'));
}, false);

const Gpio = require('onoff').Gpio;  // eslint-disable-line
const button = new Gpio(4, 'in', 'both');

button.watch((err, value) => {
  if (err) throw err;
  if (value === 1) {
    cronDebug(`Button pressed with value = ${value}. Downloading Photos!`);
    pyshell.send('tft true');
    pyshell.send('status false');
    photoframe.downloadPhotos(dbCloudDir, () => {
      cronDebug('Completed Fetch task and running refreshDisplay');
      pyshell.send('status true');
      pyshell.send('fbi');
    });
  } else
    cronDebug(`Button pressed with value = ${value}. Not doing a thing!`);
});


module.exports = {
  start() {
    cronDebug('Registering cron tasks:');
    // Fetch.start();
    FBI.start();
    WeekEndMorningOn.start();
    WeekDayMorningOn.start();
    WeekDayMorningOff.start();
    WeekDayAfternnOn.start();
    SleepDisplay.start();
    cronDebug('Done registering cron tasks');
  },
};
