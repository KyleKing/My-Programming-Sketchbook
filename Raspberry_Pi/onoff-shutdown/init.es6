console.log('Note: If module compile error, run `npm rebuild` or delete ' +
  'the node_modules folder and reinstall with `npm install`');

const fs = require('fs-extra');

const Gpio = require('onoff').Gpio;  // eslint-disable-line
const button = new Gpio(4, 'in', 'both');
const led = new Gpio(14, 'out');
const shell = require('shelljs');
const Moment = require('moment');

let fullPath = '';
let myProcess = '';
let logFile = '';
let dir = '';
let shutdownDevice = true;

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

function prettifyLog(raw) {
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

function logData(buf) {
  if (buf && buf.length > 0) {
    const data = buf.trim();
    // Ignore repetitive text from shairpoint-sync:
    if (!/^Sync error:\d+\./.test(data) && data.length !== 0) {
      const cleanData = prettifyLog(data);
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
  } else
    console.log('No data to log?');
}

function logOutput(code, stdout, stderr) {
  logData(`Exit code: ${code} and STDOUT:`);
  logData(stdout);
  if (stderr) {
    logData('stderr:');
    logData(stderr);
  }
}

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

//
// Configure local environment:
//

//
// My Local Laptop Testing (Will need to `npm remove onoff`):
const testPathLocal = '/Users/kyleking/Developer/';
logData(`  is Macbook: ${!existSync('/home/pi/')}`);
logData(`  is Macbook: ${existSync(testPathLocal)}`);
if (!existSync('/home/pi/')) {
  shutdownDevice = false;
  fullPath = '/Users/kyleking/Developer/My-Programming-Sketchbook/' +
    'Raspberry_Pi/onoff-shutdown';
  myProcess = 'node loop.js';
  logFile = '_pyloop_log';
}

//
// PiSlideShow Version:
const testPathPiSlideShow = '/home/pi/_D4_SD.ini';
logData(`  is PiSlideShow: ${existSync(testPathPiSlideShow)}`);
if (existSync(testPathPiSlideShow)) {
  shutdownDevice = false;
  fullPath = '/home/pi/PiSlideShow/';
  myProcess = 'npm start';
  logFile = '_PiSlideShow_log';
}

const otherTestPathPiSlideShow = '/home/pi/_K2_SD.ini';
logData(`  is PiSlideShow: ${existSync(otherTestPathPiSlideShow)}`);
if (existSync(otherTestPathPiSlideShow)) {
  shutdownDevice = false;
  fullPath = '/home/pi/PiSlideShow/';
  myProcess = 'npm start';
  logFile = '_PiSlideShow_log';
}

//
// Airplay Speaker Version:
const testPathAirplay = '/home/pi/_K1_SD.ini';
logData(`  is Airplay: ${existSync(testPathAirplay)}`);
if (existSync(testPathAirplay)) {
  fullPath = '/home/pi/shairport-sync';
  myProcess = 'sudo shairport-sync --statistics';
  logFile = '_AirPlay_log';
}

//
// Alarm Clock Version:
const testPathAlarmClock = '/home/pi/_A0_SD.ini';
logData(`  is Alarm Clock: ${existSync(testPathAlarmClock)}`);
if (existSync(testPathAlarmClock)) {
  shutdownDevice = false;
  fullPath = '/home/pi/PiAlarm';
  myProcess = 'npm start';
  logFile = '_AlarmClock_log';
}

//
// Start child process
//

shell.cd(fullPath);
dir = `${fullPath}/logs/`;
fs.ensureDirSync(dir);
const child = shell.exec(myProcess, { async: true });

// Test WIFI Speed as control:
testWifiSpeed();

child.stdout.on('data', (data) => { logData(data); });
child.stderr.on('data', (data) => {
  logData(`[WARN stderr]: ${String(data).trim()}`);
});
child.on('close', () => {
  logData('[CLOSED]');
  // testWifiSpeed();
  // logData('.\n\n[CLOSED]\n\n.');
});

//
// Wait for button interrupt
//

button.watch((err, value) => {
  if (err) throw err;
  logOutput('Button pressed! Shutting down now');
  led.writeSync(value); // visual cue

  shell.exec(`ps aux | grep "[${myProcess[0]}]${myProcess.substr(1)}"`,
    (code, stdout, stderr) => { logOutput(code, stdout, stderr); });

  if (shutdownDevice) {
    shell.exec('sudo kill $(ps aux | grep ' +
      `"[${myProcess[0]}]${myProcess.substr(1)} | awk '{print $2}')`,
      (code, stdout, stderr) => { logOutput(code, stdout, stderr); });

    // setTimeout(shell.exec('sudo shutdown -h now'), 3000);
    logOutput('NOT SHUTTING DOWN, BUT SHOULD ^');
    button.unexport(); // Prevent re-trigger
  } else {
    logOutput('Shutdown command avoided');
    led.writeSync(0); // visual cue
  }
});

process.on('SIGINT', () => {
  logOutput('SIGINT');
  led.unexport();
  button.unexport();
});
