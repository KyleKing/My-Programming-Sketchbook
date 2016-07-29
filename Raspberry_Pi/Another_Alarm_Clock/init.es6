#!/usr/bin/env node

// Another Node.js Alarm Clock
// by Kyle King

/**
 * User variables - also set in modules/crontasks.es6
 */

/**
 * General Configuration
 */
require('babel-register');
const fs = require('fs-extra');
const program = require('commander');
program
  .version(fs.readJsonSync('package.json'))
  .option('-d, --debug', 'run in debug mode (verbose)')
  .option('-l, --local', 'when not a Raspberry Pi, run in \'local\' mode')
  .parse(process.argv);
process.env.DEBUG = program.debug || false;
process.env.LOCAL = program.local || false;

/* initialize debugger */
import { info, init } from './modules/debugger.es6';
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
  updateClockDisplay('dddd MMMM Do, h:mm:ss a');
}, () => {
  configDebug('Finished updating Clock Display');
}, false);

updateClock.start();

// Alarms - this will be tricky?
// Probably need to create a database that I can edit from a web app
// Or, use IFTT and connect a URL hook to an iPhone app (Siri SDK)?
// Or both?

const alarm = new CronJob('0 0 6 * * 1-5', () => {
  configDebug('Starting Alarm!');
  updateClockDisplay('ALARM! h:mm:ss a');
  console.log('ALARM!');
}, () => {
  configDebug('Finished running alarm');
}, false);

alarm.start();
