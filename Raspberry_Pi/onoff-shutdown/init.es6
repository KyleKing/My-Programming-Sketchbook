console.log('Note: If module compile error, run `npm rebuild` or delete ' +
  'the node_modules folder and reinstall with `npm install`\n');

const fs = require('fs-extra');
const shell = require('shelljs');
const Moment = require('moment');

// For PiSlideshow
let buttonPin = 4;
let ledPin = 14;

let USB_ID = '';
let fullPath = '';
let myProcess = '';
let logFile = '';
let dir = '';
let shutdownDevice = false;
let powerBtnConnected = false;

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


//
// Configure local environment:
//

// PiSlideShow Version:
const testPathPiSlideShow = '/home/pi/_K2_SD.ini';
if (existSync(testPathPiSlideShow)) {
  powerBtnConnected = false;
  shutdownDevice = false;
  fullPath = '/home/pi/PiSlideShow/';
  myProcess = 'npm start';
  logFile = '_PiSlideShow_log';
  buttonPin = 4;
  ledPin = 14;
  USB_ID = '0bda:8176';
}

// Airplay Speaker Version:
const testPathAirplay = '/home/pi/_K1_SD.ini';
if (existSync(testPathAirplay)) {
  // powerBtnConnected = true;
  shutdownDevice = true;
  fullPath = '/home/pi/shairport-sync';
  myProcess = 'sudo shairport-sync --statistics';
  logFile = '_AirPlay_log';
  // TODO: No button wired yet
  buttonPin = 4;
  ledPin = 14;
  USB_ID = '148f:5572';
}

// Alarm Clock Version:
const testPathAlarmClock = '/home/pi/_A0_SD.ini';
if (existSync(testPathAlarmClock)) {
  fullPath = '/home/pi/PiAlarm';
  myProcess = 'npm start';
  logFile = '_AlarmClock_log';
  // TODO: No button wired yet
  buttonPin = 19;
  ledPin = 26;
  USB_ID = '0bda:8176';
}


//
// Init Electronics
//

const Gpio = require('onoff').Gpio;  // eslint-disable-line
const button = new Gpio(buttonPin, 'in', 'both');
const led = new Gpio(ledPin, 'out');


//
// Init Logging
//

function logData(buf) {
  if (buf && buf.length > 0) {
    const data = buf.trim();
    // Ignore repetitive text from shairpoint-sync:
    if (!/^Sync error:\d+\./.test(data) && data.length !== 0) {
      const cleanData = prettifyLog(data);
      const tsData = `[${new Moment().format('HH:mm:ss')}] >> ${cleanData}\n`;
      const file = `${dir}${new Moment().format('YYMMDD')}${logFile}.txt`;
      console.log(`-> ${tsData}`.trim());
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

// Output identified device:
logData(`  is Macbook: ${!existSync('/home/pi/')}`);
logData(`  is PiSlideShow: ${existSync(testPathPiSlideShow)}`);
logData(`  is Airplay: ${existSync(testPathAirplay)}`);
logData(`  is Alarm Clock: ${existSync(testPathAlarmClock)}`);


//
// Start child process
//

shell.cd(fullPath);
dir = `${fullPath}/logs/`;
fs.ensureDirSync(dir);
const child = shell.exec(myProcess, { async: true });

child.stdout.on('data', (data) => { logData(data); });
child.stderr.on('data', (data) => {
  logData(`[WARN stderr]: ${String(data).trim()}`);
});
child.on('close', () => {
  testWifiSpeed();
  logData('.\n[CHILD PROCESS CLOSED]\n.');
});


//
// Network Monitoring Tools:
//

function logSummary(CMD, code, stderr, stdout) {
  // Useful tool for logging output of a executable statement
  logData(`'${CMD} -> Code ${code}`);
  logData(`stdout: ${stdout}`);
  if (stderr)
    logData(`stderr: ${stderr}`);
}

class checkPing {
  constructor() {
    this.pingCMD = 'ping -c 5 google.com';
    this.pingCMD_FAIL = 'ping -c 1 192.1.2.3';  // intentionally failing ping
  }
  check() {
    // Point of entry that triggers first ping and possibly reset
    this.pingIt(this.pingCMD, this.RESET);
  }
  pingIt(CMD, cb=false) {
    shell.exec(CMD, (code, stdout, stderr) => {
      logSummary(CMD, code, stderr, stdout);

      // More specific implementation with regexp (alt is w/ `code`):
      if (false) {
        regex = /\s0% packet loss/g;
        found = false
        matches = '';
        while ((matches = regex.exec(stdout)) !== null) {
            // this is necessary to avoid infinite loops with zero-width matches
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `matches`-variable.
            matches.forEach((match, groupIndex) => {
                logData(`Found ${regex}, group ${groupIndex}: ${match}`);
                found = true;
            });
        }
      } else
        // Defer to code != 0 and assume a match 'found'
        found = true;

      if (!found || code != 0) {
        logData('ERROR: FAILED with `CODE !=0`');
        if (cb)
          cb();
        else
          logData('No Callback to act on');
      } else
        logData('Passed network monitoring check');
    });
  }
  RESET() {
    // Force a reset of the USB device, then try a ping
    const sub = `lsusb -d ${USB_ID} | awk -F '[ :]'  '{ print "/dev/bus/usb/"$2"/"$4 }'`;
    const resetCMD = `sudo $(${sub} | xargs -I {} echo "./usbreset {}")`;
    logData('Error: Internet Connection Ping Test Failed');
    logData('Attempting USB device reset:');
    shell.exec(resetCMD, (_code, _stdout, _stderr) => {
      const cp = new checkPing();
      logSummary(resetCMD, _code, _stderr, _stdout);
      cp.pingIt(cp.pingCMD);
    });
  }
}

function testWifiSpeed(cb=false) {
  const CMD = 'speedtest-cli'
  logData(`FYI: Not running "${CMD}"`)
  // shell.exec(CMD, (code, stdout, stderr) => {
  //   // FYI: Pretty Ugly, but not sure how this should be implemented?
  //   const cp = new checkPing();
  //   cp.logSummary(CMD, code, stderr, stdout);
  //   if (cb)
  //     cb();
  // });
}

// Test WIFI Speed as control
testWifiSpeed();

//
// Regularly ping that the USB adapter is connected to the INTERNET
const CronJob = require('cron').CronJob;
const everyFive = '0,5,10,15,20,25,30,35,40,45,50,55'
const runPing = new CronJob(`20 ${everyFive} * * * *`, () => {
  const cp = new checkPing();
  cp.check();
}, () => {
  console.log('Stopped Wifi Monitoring Tasks')
}, false);

//
// Handle Interrupts (*Digital Button)
//

function logError(code, stdout="n/a", stderr=false) {
  logData(`Exit code: "${code}"`);
  logData(`stdout: ${stdout}`);
  if (stderr)
    logData(`stderr: ${stderr}`);
}

if (powerBtnConnected) {
  button.watch((err, value) => {
    if (err) throw err;
    logError('Button pressed! Shutting down now');
    led.writeSync(value); // visual cue

    shell.exec(`ps aux | grep "[${myProcess[0]}]${myProcess.substr(1)}"`,
      (code, stdout, stderr) => { logError(code, stdout, stderr); });

    if (shutdownDevice) {
      shell.exec(`sudo kill $(ps aux | grep [${myProcess[0]}]` +
                              `${myProcess.substr(1)} | awk '{print $2}')`,
      (code, stdout, stderr) => {
        logError(code, stdout, stderr);
      });

      // setTimeout(shell.exec('sudo shutdown -h now'), 3000);
      logError('NOT SHUTTING DOWN, BUT SHOULD ^');
      button.unexport(); // Prevent re-trigger
    } else {
      logError('Shutdown command avoided');
      led.writeSync(0); // visual cue
    }
  });
}

process.on('SIGINT', () => {
  logError('Received SIGINT - releasing buttons/LED');
  led.unexport();
  button.unexport();
});