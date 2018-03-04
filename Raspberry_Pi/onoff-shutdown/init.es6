console.log('Note: If module compile error, run `npm rebuild` or delete ' +
  'the node_modules folder and reinstall with `npm install`\n');

const fs = require('fs-extra');
const shell = require('shelljs');
const Moment = require('moment');

// For PiSlideshow
let buttonPowerPin = 4;
let ledPin = 14;

let USB_ID = '';
let fullPath = '';
let myProcess = '';
let logFile = '';
let dir = '';
let shutdownDevice = false;
let powerBtnConnected = false;
let startOnBoot = false;
let startOnBtn = false;
let powerCycleWIFI = false;

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

// PiPrinter:
//
const testPathPiPrinter = '/home/pi/_D4_SD.ini';
if (existSync(testPathPiPrinter)) {
  startOnBoot = false;
  fullPath = '/home/pi/';
  myProcess = '/home/pi/OctoPrint/venv/bin/octoprint serve';
  logFile = '_PiPrinter_log';
  startOnBtn = true;
  buttonStartPin = 23;
  powerBtnConnected = true;
  shutdownDevice = true;
  buttonPowerPin = 24;
  ledPin = 18;
  powerCycleWIFI = false;
  USB_ID = '148f:5572';  // Black 2.4/5ghz
}

// PiSlideShow:
//
const testPathPiSlideShow = '/home/pi/_Z1_SD.ini';
if (existSync(testPathPiSlideShow)) {
  startOnBoot = true;
  fullPath = '/home/pi/PiSlideShow/';
  myProcess = 'python main.py';
  logFile = '_PiSlideShow_log';
  powerBtnConnected = true;
  shutdownDevice = true;
  buttonPowerPin = 4;
  ledPin = 14;
  powerCycleWIFI = false;
  USB_ID = '0bda:8176';  // Mini 2.4ghz
}

// Airplay Speaker:
//
const testPathAirplay = '/home/pi/_K1_SD.ini';
if (existSync(testPathAirplay)) {
  startOnBoot = true;
  fullPath = '/home/pi/shairport-sync';
  myProcess = 'sudo shairport-sync --statistics';
  logFile = '_AirPlay_log';
  // TODO: No button wired yet
  // powerBtnConnected = true;
  // shutdownDevice = true;
  buttonPowerPin = 4;
  ledPin = 14;
  powerCycleWIFI = true;
  USB_ID = '148f:5572';  // White 5ghz
}

// Alarm Clock:
//
const testPathAlarmClock = '/home/pi/_B2_SD.ini';
if (existSync(testPathAlarmClock)) {
  startOnBoot = false;
  fullPath = '/home/pi/PiAlarm';
  myProcess = 'npm start';
  logFile = '_AlarmClock_log';
  startOnBtn = true;
  buttonStartPin = 12;
  powerBtnConnected = true;
  shutdownDevice = true;
  buttonPowerPin = 13;
  ledPin = 19;
  powerCycleWIFI = false;
  // USB_ID = '148f:5572';  // Black 2.4/5ghz
  USB_ID = '0bda:8176';  // Mini 2.4ghz
}


//
// Init Electronics
//

const Gpio = require('onoff').Gpio;  // eslint-disable-line
const led = new Gpio(ledPin, 'out');
let buttonPower = '';
if (powerBtnConnected) {
  buttonPower = new Gpio(buttonPowerPin, 'in', 'both');
}
let buttonStart = '';
if (startOnBtn) {
  buttonStart = new Gpio(buttonStartPin, 'in', 'both');
}

// Create log directory:
shell.cd(fullPath);
dir = `${fullPath}/logs/`;
fs.ensureDirSync(dir);

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

function startProcess(application) {
  const child = shell.exec(application, { async: true });
  child.stdout.on('data', (data) => { logData(data); });
  child.stderr.on('data', (data) => {
    logData(`[WARN stderr]: ${String(data).trim()}`);
  });
  child.on('close', () => {
    testWifiSpeed();
    logData('.\n[CHILD PROCESS CLOSED]\n.');
  });
}

if (startOnBoot) {
  startProcess(myProcess);
}


//
// Network Monitoring Tools:
//

function logSummary(CMD, code, stderr, stdout) {
  // Useful tool for logging output of a executable statement
  logData(`${CMD} -> Code ${code}`);
  logData(`stdout: ${stdout}`);
  if (stderr)
    logData(`stderr: ${stderr}`);
}

class checkPing {
  constructor() {
    this.pingCMD = 'ping -c 10 google.com';
    // this.pingCMD_FAIL = 'ping -c 1 192.1.2.3';  // intentionally failing ping
  }
  check() {
    // Point of entry that triggers first ping and possibly reset
    // logData(`Running: "${this.pingCMD}"`);
    this.pingIt(this.pingCMD, this.RESET);
  }
  pingIt(CMD, cb=false) {
    shell.exec(CMD, (code, stdout, stderr) => {
      // logSummary(CMD, code, stderr, stdout);

      // More specific implementation with regexp (alt is w/ `code`):
      let found = false
      // if (false) {
      const regex = /\s0% packet loss/g;
      let matches = '';
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
      // } else
      //   // Defer to code != 0 and assume a match 'found'
      //   found = true;

      logData(`=> Returned Code [${code}]`);
      if (!found || parseInt(code) != 0) {
        logData(`ERROR: FAILED with "CODE !=0" [${code}]`);
        logData(stdout);
        if (cb)
          cb();
        else
          logData('Error: No Callback to act on');
      }
    });
  }
  RESET() {
    // Force a reset of the USB device, then try a ping
    if (powerCycleWIFI) {
      logData('Error: Internet Ping Failed - Resetting USB Wifi adapter');
      const subCMD = `lsusb -d ${USB_ID} | awk -F '[ :]'  '{ print "/dev/bus/usb/"$2"/"$4 }'`;
      const resetCMD = `sudo $(${subCMD} | xargs -I {} echo "/home/pi/onoff-shutdown/usbreset {}")`;
      shell.exec(resetCMD, (_code, _stdout, _stderr) => {
        logSummary(resetCMD, _code, _stderr, _stdout);
        const cp = new checkPing();
        cp.pingIt(cp.pingCMD);
      });
    } else {
      logData('Error: powerCycleWIFI is disabled');
    }
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

// // Test WIFI Speed as control
// testWifiSpeed();

// //
// // Regularly ping that the USB adapter is connected to the INTERNET
// const CronJob = require('cron').CronJob;
// // const interval = '0,5,10,15,20,25,30,35,40,45,50,55'
// const interval = '0,10,20,30,40,50'
// const runPing = new CronJob(`20 ${interval} * * * *`, () => {
//   logData(`Starting new checkPing`);
//   const cp = new checkPing();
//   cp.check();
// }, () => {
//   logData('Stopped Wifi Monitoring Tasks')
// }, false);
// // Start Run Ping Cron task
// runPing.start();

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
  buttonPower.watch((err, value) => {
    if (err) throw err;
    logData(`buttonPower pressed! Shutting down now (Val:${value})`);
    // led.writeSync(1); // visual cue

    processSearch = `"[${myProcess[0]}]${myProcess.substr(1)}"`

    shell.exec(`ps aux | grep ${processSearch}`,
      (code, stdout, stderr) => { logError(code, stdout, stderr); });

    if (shutdownDevice) {
      shell.exec(`sudo kill $(ps aux | grep ${processSearch} | awk '{print $2}')`,
      (code, stdout, stderr) => {
        logError(code, stdout, stderr);
      });
      setTimeout(shell.exec('sudo shutdown -h now'), 3000);
      // logData('NOT SHUTTING DOWN, BUT SHOULD (??) ^');
      buttonPower.unexport(); // Prevent re-trigger
    } else {
      logData('Shutdown command avoided');
      led.writeSync(0); // visual cue
    }
  });
}

if (startOnBtn) {
  buttonStart.watch((err, value) => {
    if (err) throw err;
    logData(`buttonStart pressed! Starting NPM Process (Val:${value}`);
    led.writeSync(1); // visual cue
    buttonStart.unexport(); // Free button for NPM to use
    buttonStart = '';

    // Could be written to support a different start process trigger
    //  Also should consider edge case where process is already active
    startProcess(myProcess);

    led.writeSync(0); // visual cue
    logData('Done attempting to start');
  });
}

process.on('SIGINT', () => {
  logError('Received SIGINT - releasing buttons/LED');
  led.unexport();
  if (powerBtnConnected) {
    buttonPower.unexport();
  }
  if (startOnBtn && buttonStart != '') {
    buttonStart.unexport();
  }
});