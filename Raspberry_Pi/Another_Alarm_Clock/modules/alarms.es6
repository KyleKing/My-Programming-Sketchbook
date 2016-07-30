/* initialize debugger */
import { info, init } from './debugger.es6';
const configDebug = init('config');
configDebug('Debugger initialized!');

const moment = require('moment');
const PythonShell = require('python-shell');
const pyshell = new PythonShell('lcd.py');

function updateClockDisplay(format) {
  const displayText = moment().format(format);
  pyshell.send(displayText);
}

// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7 (Sun-Sat) (7 = Sun)

const CronJob = require('cron').CronJob;
const updateClock = new CronJob('* * * * * *', () => {
  configDebug('Updating Clock Display');
  updateClockDisplay('ddd - MMM Do \n h:mm:ss a');
}, () => {
  configDebug('Finished updating Clock Display');
}, false);

// Alarms - this will be tricky?
// Probably need to create a database that I can edit from a web app
// Or, use IFTT and connect a URL hook to an iPhone app (Siri SDK)?
// Or both?

const alarm = new CronJob('0 50 21 * * 1-5', () => {
  configDebug('Starting Alarm!');
  updateClockDisplay('[ALARM!! \n] h:mm:ss a');
  console.log(info('ALARM!'));
  updateClock.stop();
}, () => {
  configDebug('Finished running alarm');
}, false);


// so the program will not close instantly
process.stdin.resume();
// http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
function exitHandler(options, err) {
  updateClockDisplay('FAILED! SIGINT!');
  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}
// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));


module.exports = {
  start() {
    updateClock.start();
    alarm.start();
  },
};
