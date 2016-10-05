console.log('Note: If module compile error, run `npm rebuild` or delete ' +
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
console.log(`  is Macbook: ${!existSync('/home/pi/')}`);
console.log(`  is Macbook: ${existSync(testPathLocal)}`);
if (!existSync('/home/pi/')) {
  fullPath = '/Users/kyleking/Developer/My-Programming-Sketchbook/' +
    'Raspberry_Pi/onoff-shutdown';
  myProcess = 'node loop.js';
  logFile = '_pyloop_log';
}

//
// PiSlideShow Version:
const testPathPiSlideShow = '/home/pi/_D4_SD.ini';
console.log(`  is PiSlideShow: ${existSync(testPathPiSlideShow)}`);
if (existSync(testPathPiSlideShow)) {
  fullPath = '/home/pi/PiSlideShow/';
  myProcess = 'npm start';
  logFile = '_PiSlideShow_log';
}

//
// Airplay Speaker Version:
const testPathAirplay = '/home/pi/_K1_SD.ini';
console.log(`  is Airplay: ${existSync(testPathAirplay)}`);
if (existSync(testPathAirplay)) {
  fullPath = '/home/pi/shairport-sync';
  myProcess = 'sudo shairport-sync --statistics';
  logFile = '_AirPlay_log';
}

//
// Alarm Clock Version:
const testPathAlarmClock = '/home/pi/_A0_SD.ini';
console.log(`  is Alarm Clock: ${existSync(testPathAlarmClock)}`);
if (existSync(testPathAlarmClock)) {
  fullPath = '/home/pi/PiAlarm';
  myProcess = 'npm start';
  logFile = '_AlarmClock_log';
}

// -------- Don't worry about anything below this line -------- //

// -------- General Configuration -------- //
const Gpio = require('onoff').Gpio;  // eslint-disable-line

const button = new Gpio(4, 'in', 'both'); // Export GPIO #4 as an interrupt
const led = new Gpio(14, 'out');         // Export GPIO #14 as an output.

const shell = require('shelljs');
const Moment = require('moment');

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
  let data = raw.trim();
  // Clip internal new lines and add visual indent
  data = data.replace(/\n/g, '\n\t   ');
  // Get rid of ansi escape characters:
  // Source: http://stackoverflow.com/a/29497680/3219667
  data = data.replace(/[\u001b\u009b][[()#;?]*33m>>\s/, '(yellow) ');
  data = data.replace(/[\u001b\u009b][[()#;?]*38;5;8m\*\* /, '(grey) ');
  data = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''); // eslint-disable-line
  // Replace node-debugger text:
  data = data.replace(/\w+,\s\d+\s\w+\s\d+\s\d+:\d+:\d+\s\w+\s(app:\w+)/g, '{$1}');
  return data;
}

//
// Create a robust logging method:
function logData(buf) {
  const data = buf.trim();
  // Ignore repetitive text from shairpoint-sync
  if (!/^Sync error:\d+\./.test(data) && data.length !== 0) {
    const cleanData = cleanUp(data);
    const tsData = `[${new Moment().format('HH:mm:ss')}] >> ${cleanData}\n`;
    const file = `${dir}${new Moment().format('YYMMDD')}${logFile}.txt`;
    console.log(`-> ${tsData}`);
    // console.log(`-> Writing to "${file}" with: ${tsData}`);
    if (!existSync(file))
      fs.writeFileSync(file, '');
    fs.appendFile(file, tsData, (err) => {
      if (err) throw err;
    });
  } else
    console.log(`IGNORED -> ${data}`);
}

//
// A little utility function:
function testWifiSpeed() {
  logData('[TODO]: No longer logging wifi speeds');
  // shell.exec('speedtest-cli', (code, stdout, stderr) => {
  //   logData('Running speedtest-cli');
  //   logData(stdout);
  //   if (stderr)
  //     logData(stderr);
  //   logData('Finished speedtest-cli');
  // });
}

// -------- Respond to child -------- //

// // Test WIFI Speed as control:
// testWifiSpeed();

child.stdout.on('data', (data) => {
  logData(data);
});
child.stderr.on('data', (data) => {
  logData(`[WARN stderr]: ${String(data).trim()}`);
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
