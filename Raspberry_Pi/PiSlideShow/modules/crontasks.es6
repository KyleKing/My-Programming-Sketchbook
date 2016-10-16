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
//    Setup the on/off cycles of the LCD display
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
const WKNDActivateDisplay = controlDisplay('0 30 9 * * 0,6', 'LCD True', 'ActivateDisplay');
const WKDYActivateDisplay = controlDisplay('0 30 19 * * *', 'LCD True', 'ActivateDisplay');
const SleepDisplay = controlDisplay('0 30 20 * * *', 'LCD False', 'SleepDisplay');


// ##########################################################
//    Keep Local Images Directory in Sync
// ##########################################################

function refreshDisplay() {
  cronDebug('Completed Fetch task and running refreshDisplay');
  pyshell.send('FbI');
}

// Check for new photos as often as possible:
const dbCloudDir = 'Apps/Balloon.io/aloo';
// // const Fetch = new CronJob('0 0,10,20,30,40,50 * * * *', () => {
// const Fetch = new CronJob('0 5,35 * * * *', () => {
//   cronDebug('Fetching Photos');
//   photoframe.downloadPhotos(dbCloudDir, refreshDisplay);
// }, () => {
//   console.log(warn('!! Completed Fetch Cron Task !!'));
// }, false);

const Gpio = require('onoff').Gpio;  // eslint-disable-line
const button = new Gpio(4, 'in', 'both');

button.watch((err, value) => {
  if (err) throw err;
  cronDebug(`Button pressed with value = ${value}. Fetching Photos!`);
  photoframe.downloadPhotos(dbCloudDir, refreshDisplay);
});


module.exports = {
  start() {
    cronDebug('Starting cron tasks!');
    // Fetch.start();
    WKNDActivateDisplay.start();
    WKDYActivateDisplay.start();
    SleepDisplay.start();
  },
};
