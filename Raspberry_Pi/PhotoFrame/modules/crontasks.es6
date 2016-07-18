/* initialize debugger */
import { error, warn, info, init } from './debugger.es6';
const cronDebug = init('cron');
const photoframe = require('./photoframe.es6');

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

const Fetch = new CronJob('00 01 * * * *', () => {
  cronDebug('Fetching Photos');
  photoframe.downloadPhotos(dbCloudDir);
}, () => {
  console.log(info('Finished Fetch Cron Task'));
}, false);

// Refresh image every 1/4 minute
const SlideShow = new CronJob('05,15,25,35,45,55 * * * * *', () => {
  cronDebug('Starting slideShow CronJob');
  photoframe.runFBI();
}, () => {}, false);

// Should remove all instances of FBI, but always reports: 'command failed'?
// When actually seems to work?
const KillOldFBI = new CronJob('10 * * * * *', () => {
  // kill previous processes to avoid sudden crashing:
  const clearCMD = 'sudo kill $(ps aux | grep \'[f]bi\'' +
    ' | awk \'{print $2}\');';
  exec(clearCMD, (childerr, stdout, stderr) => {
    cronDebug(warn(`Attempting to Clear List of PID: ${clearCMD}`));
    if (childerr) cronDebug(warn(childerr));
    if (stdout) cronDebug(warn(`stdout: ${stdout}`));
    if (stderr) cronDebug(error(`stderr: ${stderr}`));
  });
}, () => {}, false);

module.exports = {
  /**
   * Schedule update tasks to update locally stored images
   */
  start() {
    cronDebug('Starting crontask.start()');
    Fetch.start();
    SlideShow.start();
    KillOldFBI.start();
  },
};
