/* initialize debugger */
import { error, warn, info, ignore, init } from './debugger.es6';
const cronDebug = init('cron');

const exec = require('child_process').exec;

const photoframe = require('./photoframe.es6');

/**
 * Schedule update tasks to update locally stored images
 */

/*
 * Runs every weekday (Monday through Friday)
 * at 11:30:00 AM. It does not run on Saturday
 * or Sunday.
 */
// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7

const CronJob = require('cron').CronJob;
const Fetch = new CronJob('00 05 * * * *',
  () => {
    cronDebug('Fetching Photos');
    photoframe.fetchDropboxPhotos();
  },
  () => {
    console.log(info('Finished Fetch Task'));
  }, false);

// Refresh image every 1/4 minute
const SlideShow = new CronJob('05,15,25,35,45,55 * * * * *', () => {
  cronDebug('Starting slideShow CronJob');
  photoframe.runFBI();
}, () => {}, true);

// Should remove all instances of FBI, but always reports: 'command failed'?
// When actually seems to work?
const KillOldFBI = new CronJob('10 * * * * *', () => {
  // // Get a list of PID's for running FBI instances
  // // const CheckPIDCommand = 'ps aux | grep \'[f]bi\' | awk \'{print $2}\'';
  // const CheckPIDCommand = 'ps aux | grep \'[f]bi\'';
  // const childCheck = exec(CheckPIDCommand, (childerr, stdout, stderr) => {
  //   cronDebug(warn(`Checking List of PID: ${CheckPIDCommand}`));
  //   if (childerr) cronDebug(warn(childerr));
  //   if (stdout) cronDebug(warn(`stdout: ${stdout}`));
  //   if (stderr) cronDebug(error(`stderr: ${stderr}`));
  // });

  // kill previous processes to avoid sudden crashing:
  const clearCMD = 'sudo kill $(ps aux | grep \'[f]bi\'' +
    ' | awk \'{print $2}\');';
  const childClear = exec(clearCMD, (childerr, stdout, stderr) => {
    cronDebug(warn(`Attempting to Clear List of PID: ${clearCMD}`));
    if (childerr) cronDebug(warn(childerr));
    if (stdout) cronDebug(warn(`stdout: ${stdout}`));
    if (stderr) cronDebug(error(`stderr: ${stderr}`));
  });
}, () => {}, true);

module.exports = {

  /**
   * Configure setup and scoped variables
   */
  start() {
    cronDebug('Starting crontask.start()');
    Fetch.start();
    SlideShow.start();
    KillOldFBI.start();
  },
};
