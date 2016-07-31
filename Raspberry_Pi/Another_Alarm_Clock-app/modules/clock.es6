// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7 (Sun-Sat) (7 = Sun)

/* initialize debugger */
import { init } from './debugger.es6';
const clockDebug = init('clock');
clockDebug('Debugger initialized!');

const moment = require('moment');
const PythonShell = require('python-shell');
let pyshell = {};
if (process.env.LOCAL === 'false')
  pyshell = new PythonShell('lcd.py');
const CronJob = require('cron').CronJob;

module.exports = {
  start() {
    this.initClock();
    this.displayAppQuit();
  },

  initClock() {
    // Start Clock Display
    const updateClock = new CronJob('* * * * * *', () => {
      clockDebug('Updating Clock Display');
      this.updateClockDisplay('ddd - MMM Do \n h:mm:ss a');
    }, () => {
      clockDebug('Stopped updating Clock Display');
    }, true);
    updateClock.start();
  },

  // Universal Method for Interfacing with LCD Display
  updateClockDisplay(format) {
    const displayText = moment().format(format);
    if (process.env.LOCAL === 'false')
      pyshell.send(displayText);
    clockDebug(`New Clock Text: \n ${displayText}`);
  },

  displayAppQuit() {
    // Handle a breakdown in the app:
    // http://stackoverflow.com/a/14032965
    // So the program will not close instantly
    process.stdin.resume();
    function exitHandler(options, updateClockDisplay, err) {
      updateClockDisplay('[APP FAILED! NO CLOCK!] \n h:mm:ss a');
      if (err) console.log(err.stack);
      if (options.exit)
        setTimeout(500, process.exit());
    }

    process.on('exit', exitHandler.bind(null, { exit: true },
      this.updateClockDisplay
    ));
    process.on('SIGINT', exitHandler.bind(null, { exit: true },
      this.updateClockDisplay
    ));
    process.on('uncaughtException', exitHandler.bind(null, { exit: true },
      this.updateClockDisplay
    ));
  },
};
