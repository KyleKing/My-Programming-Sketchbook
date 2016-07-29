#!/usr/bin/env node

/**
 * CLI Arguments:
 */
var program = require('commander');
program
  .version('1.0.0')
  .option('-M, --melter', 'single heat stage melter version')
  .option('-m, --monitor', 'shut down peltier elements and monitor temperature')
  .option('-d, --debug', 'run in debug mode (verbose)')
  .option('-l, --local', 'when not a Raspberry Pi, run in \'local\' mode')
  .parse(process.argv);

process.env.MELTER = program.melter || false;
process.env.MONITOR = program.monitor || false;
process.env.DEBUG = program.debug || false;
process.env.LOCAL = program.local || false;

var debug = require('debug');
if (process.env.DEBUG === 'true') debug.enable('app:*');

var initDebug = debug('app:init');
initDebug('MELTER = ' + process.env.MELTER);
initDebug('MONITOR = ' + process.env.MONITOR);
initDebug('LOCAL = ' + process.env.LOCAL);

// var fs = require('fs-extra');
var fs = require('fs');
fs.access('thingspeakkey.json', fs.R_OK | fs.W_OK, function(err) {
  if (err)
    throw new Error ('Please make a thingspeakkey.json file. See: ' +
      'https://github.com/KyleKing/MML-HeatStage#configure-thingspeak');
});


var tempController = require('./modules/tempController.js');
var clc = require('cli-color');
var warning = clc.yellow.bold;

/**
 * Get things started:
 */
tempController.init();

/**
 * Example running a Chemyx Syringe Pump
 */
var pumpController = require('./modules/pumpController.js');
var ports = pumpController.init();
ports.forEach(logPorts);
var serialPort = [];
function logPorts(element, index) {
  console.log('a[' + index + '] = ' + element);
  serialPort.push(pumpController.createConnection(element.comName));
}
// Test some stuff:
// var currentPort = serialPort[0];
// pumpController.help(currentPort);
// pumpController.parseParameters(currentPort);

/**
 * Gracefully Quit and remind user
 */
process.on( 'SIGINT', function() {
  console.log(warning('\nThe heating elements are on -> Run: node off.js'));
  console.log(warning('The fate of this lab lies in your hands.'));
  process.exit( );
});
