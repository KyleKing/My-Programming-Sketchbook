const Gpio = require('onoff').Gpio;  // Constructor function for Gpio objects.
const button = new Gpio(4, 'in', 'both'); // Export GPIO #4 as an interrupt
const led = new Gpio(14, 'out');         // Export GPIO #14 as an output.
const shell = require('shelljs');

// Make sure to set this! With a proper path too:
const myProcess = 'python loop.py';

// Start your looping process:
const child = shell.exec(myProcess, { async: true });

button.watch((err, value) => {
  if (err) throw err;
  console.log('Button pressed!, Shutting down now');
  led.writeSync(value); // visual cue

  // Kill Looping Script:
  shell.exec(`ps aux | grep [${myProcess[0]}]${myProcess.substr(1)}`);
  for (let i = 1; i >= 0; i--) {
    console.log(`killling ${child.pid + i}`);
    shell.exec(`kill ${child.pid + i}`);
  }

  setTimeout(shell.exec('sudo shutdown -h now'), 3000);
  button.unexport(); // Prevent re-trigger
});

process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});
