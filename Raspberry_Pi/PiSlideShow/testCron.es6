#!/usr/bin/env node

// Raspberry Pi PhotoFrame
// by Kyle King

/**
 * User variables - also set in modules/crontasks.es6
 */
// const dbCloudDir = 'Apps/Balloon.io/aloo';

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

// const config = require('./modules/configure.es6');
// config.init(dbCloudDir);

const crontasks = require('./modules/crontasks.es6');
crontasks.start();
