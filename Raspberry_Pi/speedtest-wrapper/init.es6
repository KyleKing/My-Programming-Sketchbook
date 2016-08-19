const shell = require('shelljs');
const fs = require('fs-extra');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const secret = fs.readJsonSync('secret.json');
const xhr = new XMLHttpRequest();

// const req = http.request(options, callback);
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

let speedtestPATH = '';
let deviceName = '';

//
// My Local Laptop Testing (Will need to `npm remove onoff`):
console.log(`is Macbook: ${!existSync('/home/pi/')}`);
console.log(`is Macbook: ${existSync('/Users/kyleking/Developer/')}`);
if (!existSync('/home/pi/')) {
  speedtestPATH = '/Users/kyleking/anaconda/bin/';
  deviceName = 'MacbookPro';
}

//
// PhotoFrame Version:
console.log(`is PhotoFrame: ${existSync('/home/pi/_D4_SD.ini')}`);
if (existSync('/home/pi/_D4_SD.ini')) {
  speedtestPATH = '/???/';
  deviceName = 'PhotoFrame';
}

shell.exec(`${speedtestPATH}speedtest-cli --secure`, (code, stdout, stderr) => {
  if (stderr)
    throw new Error(stderr);
  if (stdout)
    if (/failed/i.test(stdout))
      xhr.ofpen('GET', `https://maker.ifttt.com${secret.path}?value1=FAILED&value2=FAILED&value3=FAILED`, false);
    else {
      const dl = stdout.match(/Download: (\d+.\d+)(.+bit\/s)/i);
      const ul = stdout.match(/Upload: (\d+.\d+)(.+bit\/s)/i);
      const eg = {
        // time: new Date(),
        device: deviceName,
        ip: stdout.match(/ \((\d+.\d+.\d+.\d+)\).../i)[1].trim(),
        ping: stdout.match(/km]: (\d+.\d+) ms/i)[1].trim(),
        pingValue: 'ms',
        dl: dl[1].trim(),
        dlValue: dl[2].trim(),
        ul: ul[1].trim(),
        ulValue: ul[2].trim(),
      };
      console.log('Finished speedtest-cli');
      console.log(eg);
      xhr.open('GET', `https://maker.ifttt.com${secret.path}?value1=${eg.ping}&value2=${eg.dl} ${eg.dlValue}&value3=${eg.ul} ${eg.ulValue}`, false);
      xhr.send();
    }
});
