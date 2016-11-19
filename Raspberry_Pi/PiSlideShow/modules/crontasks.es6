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
const weekDayMorningOn = controlDisplay('0 15 5 * * 1-5', 'tft true', 'WeekDayMorningOn');
const weekDayAfternnOn = controlDisplay('0 30 16 * * 1-5', 'tft true', 'WeekDayAfternnOn');
const weekEndMorningOn = controlDisplay('0 30 8 * * 0,6', 'tft true', 'WeekEndMorningOn');

const weekDayMorningOff = controlDisplay('0 30 6 * * 1-5', 'tft false', 'WeekDayMorningOff');
const sleepDisplay = controlDisplay('0 30 21 * * *', 'tft false', 'SleepDisplay');


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

// Make sure FBI task is always up to date:
const FBI = new CronJob('0 0 * 12 * *', () => {
  cronDebug('Refreshing FBI Task');
  pyshell.send('fbi killoldfbi');
}, () => {
  console.log(warn('!! Completed Refresh FBI Task !!'));
}, false);


// Watch for button-press request to update the display:
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
      pyshell.send('fbi killoldfbi');
      cronDebug('Finished fetch task - running refreshDisplay');
    });
  } else
    cronDebug(`Button pressed with value = ${value}. Not doing a thing!`);
});


module.exports = {
  start() {
    cronDebug('Registering cron tasks:');
    // Fetch.start();
    FBI.start();
    weekEndMorningOn.start();
    weekDayMorningOn.start();
    weekDayMorningOff.start();
    weekDayAfternnOn.start();
    sleepDisplay.start();

    const keepAwake = new CronJob('0 0,15,30,45 * * * *', () => {
      console.log('...');
    }, () => {
      console.log('Completed keepAwake cron task');
    }, false);
    keepAwake.start();

    cronDebug('Initializing the display!');
    pyshell.send('status true');
    pyshell.send('fbi killoldfbi');
    cronDebug('Done registering cron tasks');
  },
};
