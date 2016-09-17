/* initialize debugger */
import { error, warn, info, init } from './debugger.es6';
const cronDebug = init('cron');
const photoframe = require('./photoframe.es6');

const _ = require('underscore');
const CronJob = require('cron').CronJob;
const exec = require('child_process').exec;

const dbCloudDir = 'Apps/Balloon.io/aloo';

// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7

// Kill all but the last running FBI process:
function killOldFBI() {
  const listProc = "ps aux | grep [f]bi | awk '{print $2}'";
  exec(listProc, (childerr, stdout, stderr) => {
    cronDebug(warn(`Getting PID list: ${listProc}`));
    if (stdout) {
      console.log(warn('stdout:'));
      console.log(warn(stdout));
      let PIDs = stdout.trim().split(/\W+/);
      PIDs = PIDs.sort((a, b) => a - b);
      const popped = PIDs.pop();
      const PIDsLen = PIDs.length;
      if (popped && PIDsLen > 1) {
        console.log('\nStopping:');
        console.log(PIDs);
        _.each(PIDs, (PID) => {
          console.log(`\n(NOT) Killing: ${PID}`);
          exec(`sudo kill ${PID}`, (PIDShildErr, PIDout, PIDerror) => {
            cronDebug(warn(`Getting PID list: ${listProc}`));
            if (PIDout) cronDebug(PIDout);
            if (PIDShildErr) cronDebug(warn(PIDShildErr));
            if (PIDerror) cronDebug(error(`PIDerror: ${PIDerror}`));
          });
        });
      }
    } else {
      cronDebug('Starting new FBI process because none running:');
      photoframe.runFBI();
    }
    if (childerr) cronDebug(warn(childerr));
    if (stderr) cronDebug(error(`stderr: ${stderr}`));
  });
}

// Start a fresh slide show 3 times/hour to add new images
const SlideShow = new CronJob('0 5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
  cronDebug('Starting slideShow CronJob');
  photoframe.runFBI();
  setTimeout(() => {
    cronDebug('Starting Kill Old FBI after timeout');
    killOldFBI();
  }, 5000);
}, () => {
  console.log(warn('!! Completed SlideShow Cron Task !!'));
}, false);

// Check to see that only one FBI process is running at regular intervals
const CheckOnFBI = new CronJob('10 0,10,20,30,40,50 * * * *', () => {
  cronDebug('Starting Check on All FBI processes');
  killOldFBI();
}, () => {
  console.log(warn('!! Completed CheckOnFBI Cron Task !!'));
}, false);


// Check for new photos as often as possible:
const Fetch = new CronJob('0 2,7,12,17,22,27,32,37,42,47,52,57 * * * *', () => {
  cronDebug('Fetching Photos');
  photoframe.downloadPhotos(dbCloudDir);
}, () => {
  console.log(warn('!! Completed Fetch Cron Task !!'));
}, false);

// // Kill all but last running process:
// const KillOldFBI = new CronJob('0 16,46 * * * *', () => {
//   const listProc = "ps aux | grep [f]bi | awk '{print $2}'";

//   exec(listProc, (childerr, stdout, stderr) => {
//     cronDebug(warn(`Getting PID list: ${listProc}`));
//     if (stdout) {
//       console.log(warn('stdout:'));
//       console.log(warn(stdout));
//       let PIDs = stdout.trim().split(/\W+/);
//       PIDs = PIDs.sort((a, b) => a - b);
//       const popped = PIDs.pop();
//       const PIDsLen = PIDs.length;
//       if (popped && PIDsLen > 1) {
//         console.log('\nStopping:');
//         console.log(PIDs);
//         _.each(PIDs, (PID) => {
//           console.log(`\n(NOT) Killing: ${PID}`);
//           exec(`sudo kill ${PID}`, (PIDShildErr, PIDout, PIDerror) => {
//             cronDebug(warn(`Getting PID list: ${listProc}`));
//             if (PIDout) cronDebug(PIDout);
//             if (PIDShildErr) cronDebug(warn(PIDShildErr));
//             if (PIDerror) cronDebug(error(`PIDerror: ${PIDerror}`));
//           });
//         });
//       }
//     } else {
//       cronDebug('Starting new FBI process because none running:');
//       photoframe.runFBI();
//     }
//     if (childerr) cronDebug(warn(childerr));
//     if (stderr) cronDebug(error(`stderr: ${stderr}`));
//   });
// }, () => {}, false);

module.exports = {
  /**
   * Schedule update tasks to update locally stored images
   */
  start() {
    cronDebug('Starting crontask.start()');
    Fetch.start();
    SlideShow.start();
    CheckOnFBI.start();
  },
};
