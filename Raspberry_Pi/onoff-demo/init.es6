const Gpio = require('onoff').Gpio;  // Constructor function for Gpio objects.
const button = new Gpio(4, 'in', 'both'); // Export GPIO #4 as an interrupt
const led = new Gpio(14, 'out');         // Export GPIO #14 as an output.
const shell = require('shelljs');
const fs = require('fs-extra');
const moment = require('moment');

// // Make sure to set this! With a proper path too:
// // Get full path with "echo $PWD"
// // const fullPath = '/home/pi/';
// // // Copy `cp loop.py ~/aloop.py`:
// // const myProcess = 'python aloop.py';
// const myProcess = 'python loop.py';

// PhotoFrame Version:
const fullPath = '/home/pi/PhotoFrame/';
const myProcess = 'node init.es6 -d';

// // Airplay Speaker Version:
// const fullPath = '/home/pi/shairport-sync';
// const myProcess = 'sudo shairport-sync --statistics';

// -------- Don't worry about anything below this line --------

// Go to proper path for looping process (SET ABOVE)
if (fullPath) shell.cd(fullPath);
// console.log(shell.ls());

// Configure debugging directory
const dir = `${fullPath}logs/`;
fs.ensureDirSync(dir);
const filetype = '_PhotoFrame_log.txt';

// Start your looping process:
const child = shell.exec(myProcess, { async: true });
child.stdout.on('data', (data) => {
  const date = new Date();
  const file = `${dir}${moment(date).format('YYYY_MM_DD')}${filetype}`;
  // If doesn't exist, create a new file
  try {
    fs.accessSync(file, fs.F_OK);
  } catch (e) {
    fs.writeFileSync(file);
  }
  fs.appendFile(file, data, (err) => {
    if (err) throw err;
  });
});

button.watch((err, value) => {
  if (err) throw err;
  console.log('Button pressed!, Shutting down now');
  led.writeSync(value); // visual cue

  // Kill Looping Script:
  shell.exec(`ps aux | grep "[${myProcess[0]}]${myProcess.substr(1)}"`);
  for (let i = 1; i >= 0; i--) {
    console.log(`killling ${child.pid + i}`);
    shell.exec(`kill ${child.pid + i}`);
  }

  // setTimeout(shell.exec('sudo shutdown -h now'), 3000);
  button.unexport(); // Prevent re-trigger
});

process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});
