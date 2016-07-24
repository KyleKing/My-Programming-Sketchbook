const Gpio = require('onoff').Gpio;  // Constructor function for Gpio objects.
const button = new Gpio(4, 'in', 'both'); // Export GPIO #4 as an interrupt
const led = new Gpio(14, 'out');         // Export GPIO #14 as an output.
const shell = require('shelljs');
const fs = require('fs-extra');
const moment = require('moment');

// -------- Don't worry about anything Above this line -------- //

// Make sure to set this! With a proper path too:

// // Get full path with "echo $PWD"
// const fullPath = '/home/pi/';
// // Copy `cp loop.py ~/aloop.py`:
// const myProcess = 'python aloop.py';
// const logFile = '_pyloop_log';

// // PhotoFrame Version:
// const fullPath = '/home/pi/PhotoFrame/';
// const myProcess = 'node init.es6 -d';
// const logFile = '_PhotoFrame_log';

// // Airplay Speaker Version:
// const fullPath = '/home/pi/shairport-sync';
// const myProcess = 'sudo shairport-sync --statistics';
// const logFile = '_AirPlay_log';

// Airplay Speaker Version:
const fullPath = '/home/pi/Another_Alarm_Clock';
const myProcess = 'node init.es6';
const logFile = '_AlarmClock_log';


// -------- Don't worry about anything below this line -------- //

// Go to proper path for looping process (SET ABOVE)
if (fullPath) shell.cd(fullPath);
// console.log(shell.ls());

// Configure debugging directory
const dir = `${fullPath}/logs/`;
fs.ensureDirSync(dir);

// Start your looping process:
const child = shell.exec(myProcess, { async: true });

// Log stdout to a file logging system (logs/YYYY_MM_DD_(your filename).txt)
child.stdout.on('data', (data) => {
  // COnfid file and dir
  const date = new Date();
  const file = `${dir}${moment(date).format('YYYY_MM_DD')}${logFile}.txt`;
  const tsData = `${moment(date).format('HH:mm:ss')}& ${data}`;
  // console.log(`-> Writing to ${file} with ${tsData}`);
  try {
    fs.accessSync(file, fs.F_OK);
  } catch (e) {
    fs.writeFileSync(file);
  }
  // Write to file:
  fs.appendFile(file, tsData, (err) => {
    if (err) throw err;
  });
});

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
