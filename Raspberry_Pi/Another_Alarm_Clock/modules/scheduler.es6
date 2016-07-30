/* initialize debugger */
// import { init } from './debugger.es6';
// const configDebug = init('scheduler');
// configDebug('Debugger initialized!');

const moment = require('moment');
// const PythonShell = require('python-shell');
// const pyshell = new PythonShell('lcd.py');

function updateClockDisplay(format) {
  const displayText = moment().format(format);
  console.log(displayText);
  // pyshell.send(displayText);
}

const CronJob = require('cron').CronJob;
const ClockAlarms = {};


function scheduleCron(cronID, cronSchedule) {
  // ClockAlarms.demo = new CronJob('0 0 6 * * 1-5', () => {
  ClockAlarms[cronID] = new CronJob(cronSchedule, () => {
    console.log('Starting Alarm!');
    updateClockDisplay('[ALARM!] \n h:mm:ss a');
    console.log('ALARM!');
  }, () => {
    console.log('Finished running alarm');
  }, false);
}

const uniq = moment().format('YYYY_DDDD_kk_mm_ss');
console.log(uniq);
const schedule = '* * * * * *';
scheduleCron(uniq, schedule);

// --------- DataStore --------

// Check if previous datastore exists,
// if so read all data and reintialize cron tasks

const Datastore = require('nedb');
const crons = new Datastore({
  filename: `${__dirname}/../data/crons`,
  autoload: true,
});
crons.insert({ uniq, schedule });

// For Testing
ClockAlarms[uniq].start();
setTimeout(() => ClockAlarms[uniq].stop(), 5000);


module.exports = function(io) {
  io.on('connection', function(socket) {
    // console.log('a user connected');
    io.emit('BROWSER_REFRESH_URL', process.env.BROWSER_REFRESH_URL);

    /**
     * Respond to Button Events
     */
    socket.on('start', function() {
      io.emit('step', [1], [pref.statuses[0]]);
      require(__dirname + '/server-python-controller.js').start(io, socket);
    });
    socket.on('stop', function() {
      io.emit('step', range(1,6), [pref.statuses[2]]);
    });
    socket.on('capture', function() {
      require(__dirname + '/server-python-controller.js').capture(io, socket);
    });
  });
};

module.exports = { crons, ClockAlarms };
