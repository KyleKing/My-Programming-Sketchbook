// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7 (Sun-Sat) (7 = Sun)

/* initialize debugger */
import { init } from './debugger.es6';
const schedDebug = init('sched');
schedDebug('Debugger initialized!');

import { updateClockDisplay } from './clock.es6';
const CronJob = require('cron').CronJob;

module.exports = {
  // General Task to Schedule a cron job attached to a process var
  scheduleCron(cronSchedule) {
    return new CronJob(cronSchedule, () => {
      schedDebug('Starting Alarm!');
      updateClockDisplay('[ALARM!] \n h:mm:ss a');
    }, () => {
      schedDebug('Alarm Task Canceled');
    }, false);
  },
};

// // How to call scheduleCton:
// const moment = require('moment');
// const ClockAlarms = {};
// const sched = require('scheduleCron.es6')

// const uniq = moment().format('YYYY_DDDD_kk_mm_ss');
// // console.log(`Uniq: ${uniq}`);
// const schedule = '* * * * * *';
// sched.scheduleCron(uniq, schedule);

// // For Testing
// ClockAlarms[uniq].start();
// setTimeout(() => ClockAlarms[uniq].stop(), 5000);
