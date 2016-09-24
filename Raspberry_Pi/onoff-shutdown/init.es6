console.log('If module compile error (etc.), just run `npm rebuild` or delete ' +
  'the node_modules folder and reinstall with `npm install`');

const fs = require('fs-extra');

// Synchronous version of fs.access with a silent error (for if loops!):
function existSync(filename) {
  let status = true;
  try {
    fs.accessSync(filename, fs.F_OK);
  } catch (e) {
    status = false;
  }
  return status;
}

//
// Make sure to set these values inside of the if-loops below!!
// Get full path with "echo $PWD"
//

let fullPath = '';
let myProcess = '';
let logFile = '';

//
// My Local Laptop Testing (Will need to `npm remove onoff`):
const testPathLocal = '/Users/kyleking/Developer/';
console.log(`is Macbook: ${!existSync('/home/pi/')}`);
console.log(`is Macbook: ${existSync(testPathLocal)}`);
if (!existSync('/home/pi/')) {
  fullPath = '/Users/kyleking/Developer/My-Programming-Sketchbook/' +
    'Raspberry_Pi/onoff-shutdown';
  myProcess = 'node loop.js';
  logFile = '_pyloop_log';
}

//
// PiSlideShow Version:
const testPathPiSlideShow = '/home/pi/_D4_SD.ini';
console.log(`is PiSlideShow: ${existSync(testPathPiSlideShow)}`);
if (existSync(testPathPiSlideShow)) {
  fullPath = '/home/pi/PiSlideShow/';
  myProcess = 'node init.es6 -d';
  logFile = '_PiSlideShow_log';
}

//
// Airplay Speaker Version:
const testPathAirplay = '/home/pi/_B2_SD.ini';
console.log(`is Airplay: ${existSync(testPathAirplay)}`);
if (existSync(testPathAirplay)) {
  fullPath = '/home/pi/shairport-sync';
  myProcess = 'sudo shairport-sync --statistics';
  logFile = '_AirPlay_log';
}

//
// Alarm Clock Version:
const testPathAlarmClock = '/home/pi/_A0_SD.ini';
console.log(`is Alarm Clock: ${existSync(testPathAlarmClock)}`);
if (existSync(testPathAlarmClock)) {
  fullPath = '/home/pi/CallStatusDashboard';
  myProcess = 'npm start';
  logFile = '_AlarmClock_log';
}

// -------- Don't worry about anything below this line -------- //

// -------- General Configuration -------- //
const Gpio = require('onoff').Gpio;  // Constructor function for Gpio objects.

const button = new Gpio(4, 'in', 'both'); // Export GPIO #4 as an interrupt
const led = new Gpio(14, 'out');         // Export GPIO #14 as an output.

const shell = require('shelljs');
const moment = require('moment');

// -------- Use the user-set variables -------- //

// Go to process directory (SET ABOVE)
shell.cd(fullPath);
// console.log(shell.ls());

// Configure debugging directory (SET ABOVE)
const dir = `${fullPath}/logs/`;
fs.ensureDirSync(dir);

// Start your looping process (SET ABOVE):
const child = shell.exec(myProcess, { async: true });

function cleanUp(raw) {
  let data = str(raw).trim();
  console.log(`>> d: ${data}`);
  // Get rid of UNIX console colors
  data = data.replace(/\^\[\[33m>>\s/, '(yellow) ');
  data = data.replace(/\^\[\[38\;5\;8m\*\* /, '(grey) ');
  data = data.replace(/\^\[\[\d+m$/, '');
  data = data.replace(/\^\[\[[^\s]+\s/, '');
  // Get rid of debugger text:
  data = data.replace(/\w+,\s\d+\s\w+\s\d+\s\d+:\d+:\d+\s\w+\sapp:/, '$$%$')
  console.log(`>> c: ${data}`);
  // data = data.replace(/\$\$%\$/, '$$%$')
  return data
}

//
// Create a robust logging method:
function logData(buf) {
  const data = buf.trim();
  // Config file and directory:
  const file = `${dir}${new moment().format('YYMMDD')}${logFile}.txt`;
  const cleanData = cleanUp(data);
  const tsData = `At ${new moment().format('HH:mm:ss')} log: ${cleanData}\n`;
  // console.log(`> ${tsData}`);
  // // console.log(`-> Writing to "${file}" with: ${tsData}`);
  if (!existSync(file))
    fs.writeFileSync(file);
  // Write to file:
  fs.appendFile(file, tsData, (err) => {
    if (err) throw err;
  });
}

//
// A little utility function:
function testWifiSpeed() {
  logData('\n\nNot running speedtest for now\n\n');
  // shell.exec('speedtest-cli', (code, stdout, stderr) => {
  //   logData('Running speedtest-cli');
  //   logData(stdout);
  //   if (stderr)
  //     logData(stderr);
  //   logData('Finished speedtest-cli');
  // });
}

// -------- Respond to child -------- //

// Test WIFI Speed as control:
testWifiSpeed();

// Log stdout to a file logging system (logs/YYYY_MM_DD_(your filename).txt)
child.stdout.on('data', (data) => {
  // console.log('[stdout]: "%s"', String(data).trim());
  logData(data);
});
child.stderr.on('data', (data) => {
  logData(`[stderr]: ${String(data).trim()}`);
});
child.on('close', () => {
  testWifiSpeed();
  logData('.\n\n[CLOSED]\n\n.');
});

// -------- Watch for a real world button press event -------- //

button.watch((err, value) => {
  if (err) throw err;
  console.log('Button pressed!, Shutting down now');
  led.writeSync(value); // visual cue

  // For development, check for process, then kill looping process:
  shell.exec(`ps aux | grep "[${myProcess[0]}]${myProcess.substr(1)}"`);
  shell.exec('sudo kill $(ps aux | grep ' +
    `"[${myProcess[0]}]${myProcess.substr(1)} | awk '{print $2}')`);

  setTimeout(shell.exec('sudo shutdown -h now'), 3000);
  button.unexport(); // Prevent re-trigger
});

process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});
