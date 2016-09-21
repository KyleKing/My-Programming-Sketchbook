/* initialize debugger */
import { error, warn, init } from './debugger.es6';
const cronDebug = init('cron');

const photoframe = require('./photoframe.es6');
const PythonShell = require('python-shell');
const CronJob = require('cron').CronJob;
const _ = require('underscore');
const exec = require('child_process').exec;

// Kill all but the last running FBI process:
function killOldFBI() {
  // FIXME: parse full ps aux, look at both timestamp and number, then kill
  // the appropriate number because processes do not always increase in value
  const listProcesses = "ps aux | grep [f]bi | awk '{print $2}'";
  exec(listProcesses, (childerr, stdout, stderr) => {
    cronDebug(warn(`Getting PID list: ${listProcesses}`));
    if (stdout) {
      // console.log(warn(stdout));
      let PIDs = stdout.trim().split(/\W+/);
      PIDs = PIDs.sort((a, b) => a - b);
      const popped = PIDs.pop();
      cronDebug(`Not Killing: ${popped}, but killing:`);
      cronDebug(PIDs);
      const PIDsLen = PIDs.length;
      if (popped && PIDsLen > 1)
        _.each(PIDs, (PID) => {
          exec(`sudo kill ${PID}`, (PIDChildErr, PIDout, PIDerror) => {
            cronDebug(warn(`Executed: sudo kill ${PID}`));
            if (PIDout) cronDebug(PIDout);
            if (PIDChildErr) cronDebug(warn(PIDChildErr));
            if (PIDerror) cronDebug(error(`PIDerror: ${PIDerror}`));
          });
        });
    } else {
      cronDebug('Starting new FBI process since none are running');
      photoframe.runFBI();
    }
    if (childerr) cronDebug(warn(childerr));
    if (stderr) cronDebug(error(`stderr: ${stderr}`));
  });
}

function refreshDisplay() {
  // Start the slideshow, then kill any conflicting instances of FBI:
  cronDebug('Fired refreshDisplay function');
  // setTimeout(() => {
  //   cronDebug('Running new FBI Instance');
  //   photoframe.runFBI();
  // }, 5000);
  // setTimeout(() => {
  //   cronDebug('Starting Kill Old FBI after timeout');
  //   killOldFBI();
  // }, 10000);
  cronDebug('But commented out to figure out enomen issue');
}


// ##########################################################
//    Keep Local Images Directory in Sync
// ##########################################################

// Check for new photos as often as possible:
const dbCloudDir = 'Apps/Balloon.io/aloo';
const Fetch = new CronJob('0 0,20,40 * * * *', () => {
  cronDebug('Fetching Photos');
  photoframe.downloadPhotos(dbCloudDir, refreshDisplay);
}, () => {
  console.log(warn('!! Completed Fetch Cron Task !!'));
}, false);


// ##########################################################
//    Keep the Slideshow running
//       and regularly refresh to load new images
// TODO: Actually wrapped up into the fetch task ^
// ##########################################################

const SlideShow = new CronJob('0 10,30,50 * * * *', () => {
  cronDebug('Running new FBI Instance');
  photoframe.runFBI();
}, () => {
  console.log(warn('!! Completed SlideShow Cron Task !!'));
}, false);

// // Start a fresh slide show 3 times/hour to add new images
// // const SlideShow = new CronJob('0 5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
// const SlideShow = new CronJob('0 0 * * * *', () => {
//   cronDebug('Starting slideShow CronJob');
//   refreshDisplay();
// }, () => {
//   console.log(warn('!! Completed SlideShow Cron Task !!'));
// }, false);

const CheckOnFBI = new CronJob('0 14,34,54 * * * *', () => {
  cronDebug('Starting CheckOnFBI/Kill Old FBI after timeout');
  killOldFBI();
}, () => {
  console.log(warn('!! Completed CheckOnFBI Cron Task !!'));
}, false);

// // // Check to see that only one FBI process is running at regular intervals
// // // const CheckOnFBI = new CronJob('10 0,10,20,30,40,50 * * * *', () => {
// // const CheckOnFBI = new CronJob('0 30 * * * *', () => {
// //   cronDebug('Starting Check on All FBI processes');
// //   killOldFBI();
// // }, () => {
// //   console.log(warn('!! Completed CheckOnFBI Cron Task !!'));
// // }, false);


// ##########################################################
//    Setup the on/off cycles of the LCD display
// ##########################################################

const pyshell = new PythonShell('toggle_LCD.py');
function toggleDisplay(state) {
  pyshell.send(state);
}

// Create the typical callbacks:
pyshell.on('message', (message) => { cronDebug(message); });
pyshell.on('close', (err) => {
  if (err)
    throw err;
  console.log('finished and closed (toggle_LCD.py)');
});
pyshell.on('error', (err) => { throw err; });

// Turn the display on when people should be around
// const ActivateDisplay = new CronJob('0 30 7,17 * * *', () => {
const ActivateDisplay = new CronJob('0 18 7,14 * * *', () => {
  cronDebug('Starting ActivateDisplay');
  toggleDisplay('True');  // i.e. on
}, () => {
  console.log(warn('!! Completed ActivateDisplay Cron Task !!'));
}, false);
// Then off when time to sleep:
const SleepDisplay = new CronJob('0 45 8,21 1-5 * *', () => {
  cronDebug('Starting SleepDisplay');
  toggleDisplay('False');  // i.e. off
}, () => {
  console.log(warn('!! Completed SleepDisplay Cron Task !!'));
}, false);


module.exports = {
  // NOT ZERO-Indexed
  // *Appears that 14 = 2 pm
  /**
   * Quick CRON guide:
      second         0-59
      minute         0-59
      hour           0-23
      day of month   0-31
      month          0-12
      day of week    0-6
   */
  start() {
    cronDebug('Starting cron tasks!');

    cronDebug('Starting slide show and powering up display');
    // photoframe.runFBI();
    // toggleDisplay('True');  // i.e. on
    // ^ Should already be on whenever pi turns on (smart HDMI)

    Fetch.start();
    SlideShow.start();
    CheckOnFBI.start();
    ActivateDisplay.start();
    SleepDisplay.start();
  },
};
