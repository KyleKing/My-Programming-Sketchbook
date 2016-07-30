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

require('./modules/alarms.es6').start();
