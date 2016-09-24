/* initialize debugger */
import { error, warn, init } from './debugger.es6';
const cronDebug = init('cron');

const photoframe = require('./photoframe.es6');
const PythonShell = require('python-shell');
const CronJob = require('cron').CronJob;
const _ = require('underscore');
const exec = require('child_process').exec;


function killAllFBI() {
  const listProcesses = "ps aux | grep [f]bi | awk '{print $2}'";
  exec(listProcesses, (childerr, stdout, stderr) => {
    cronDebug(warn(`Getting PID list: ${listProcesses}`));
    console.log(warn(stdout));
    if (childerr) cronDebug(warn(childerr));
    if (stderr) cronDebug(error(`stderr: ${stderr}`));
    const PIDs = stdout.trim().split(/\W+/);
    cronDebug(PIDs);
    const PIDsLen = PIDs.length;
    if (stdout.trim() & PIDsLen > 0)
      _.each(PIDs, (PID) => {
        exec(`sudo kill ${PID}`, (PIDChildErr, PIDout, PIDerror) => {
          cronDebug(warn(`Executed: sudo kill ${PID}`));
          if (PIDout) cronDebug(PIDout);
          if (PIDChildErr) cronDebug(warn(PIDChildErr));
          if (PIDerror) cronDebug(error(`PIDerror: ${PIDerror}`));
        });
      });
  });
}


// ##########################################################
//    Keep Local Images Directory in Sync
// ##########################################################

function refreshDisplay() {
  cronDebug('Completed Fetch task');
  killAllFBI();
}

// Check for new photos as often as possible:
const dbCloudDir = 'Apps/Balloon.io/aloo';
const Fetch = new CronJob('0 0,10,20,30,40,50 * * * *', () => {
  cronDebug('Starting fresh FBI task right before fetching!');
  photoframe.runFBI();
  cronDebug('Fetching Photos');
  photoframe.downloadPhotos(dbCloudDir, refreshDisplay);
}, () => {
  console.log(warn('!! Completed Fetch Cron Task !!'));
}, false);


// ##########################################################
//    Setup the on/off cycles of the LCD display
// ##########################################################

const pyshell = new PythonShell('toggle_LCD.py');
function toggleDisplay(state) {
  pyshell.send(state);
}

// Create the typical callbacks:
pyshell.on('message', (message) => {
  cronDebug(`(from toggle_LCD.py) Received: ${message}`);
});
pyshell.on('close', (err) => {
  if (err)
    throw err;
  console.log('Finished and closed (toggle_LCD.py)');
});
pyshell.on('error', (err) => { throw err; });


// Turn the display on when people should be around
// const ActivateDisplay = new CronJob('0 8,18,28,38,48,58 * * * *', () => {
const ActivateDisplay = new CronJob('0 30 7,17 * * *', () => {
  cronDebug('Starting ActivateDisplay');
  toggleDisplay('True');  // i.e. on
}, () => {
  console.log(warn('!! Completed ActivateDisplay Cron Task !!'));
}, false);


// Then off when time to sleep:
// const SleepDisplay = new CronJob('30 6,16,26,36,46,56 * * * *', () => {
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

    // FIXME: create custom cron cycles based on when the app starts
    // (i.e. start slideshow, check on FBI, fetch in that order with
    //    set time in between tasks [I think first thing is download])
    // cronDebug('Starting slide show and powering up display');
    // photoframe.runFBI();
    // toggleDisplay('True');  // i.e. on
    // ^ Should already be on whenever pi turns on (smart HDMI)

    Fetch.start();
    ActivateDisplay.start();
    SleepDisplay.start();
  },
};
