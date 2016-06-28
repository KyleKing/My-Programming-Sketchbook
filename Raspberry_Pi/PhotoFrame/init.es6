#!/usr/bin/env node

// Raspberry Pi PhotoFrame
// by Kyle King

/**
 * User variables
 */
const dbCloudDir = 'Apps/Balloon.io/aloo';

/**
 * General Configuration
 */
require('babel-register');

const program = require('commander');
program
  .version('1.0.0')
  .option('-d, --debug', 'run in debug mode (verbose)')
  .option('-l, --local', 'when not a Raspberry Pi, run in \'local\' mode')
  .parse(process.argv);
process.env.DEBUG = program.debug || false;
process.env.LOCAL = program.local || false;

const config = require('./modules/configure.es6');
config.init(dbCloudDir);
