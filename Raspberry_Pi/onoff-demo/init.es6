const Gpio = require('onoff').Gpio;  // Constructor function for Gpio objects.
const button = new Gpio(4, 'in', 'both'); // Export GPIO #4 as an interrupt
const led = new Gpio(14, 'out');         // Export GPIO #14 as an output.
const shell = require('shelljs');

// Start a looping process:
const child = shell.exec('python loop.py', { async: true });
// child.stdout.on('data', (data) => {
//   console.log(data);
// });

// const exec = require('child_process').exec;
// const spawn = require('child_process').spawn;
// const pyloop = spawn('sh', ['-c', 'python loop.py'], {
//   stdio: ['inherit', 'inherit', 'inherit'],
// });

// pyloop.on('close', (code, signal) => {
//   console.log(
//     `child process terminated due to receipt of signal ${signal}`);
// });

// The callback passed to watch will be called when the button on GPIO #4 is
// pressed.
button.watch((err, value) => {
  if (err) throw err;

  console.log('Button pressed!, Shutting down now');
  led.writeSync(value); // visual cue
  // Kill Python Looping Script:
  shell.exec('ps aux | grep [p]ython');
  for (let i = 1; i >= 0; i--) {
    console.log(`killling ${child.pid + i}`);
    shell.exec(`kill ${child.pid + i}`);
  }

  // pyloop.kill('SIGHUP'); // Kill child process:
  // setTimeout(shell.exec('sudo shutdown -h now'), 3000);

  // setTimeout(() => button.unexport(), 7000);
  button.unexport(); // Prevent re-trigger
});

process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});
