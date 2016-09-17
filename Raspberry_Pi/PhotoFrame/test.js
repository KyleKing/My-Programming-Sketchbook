/* initialize debugger */
const exec = require('child_process').exec;

function numericAsc(a, b) {
  return a - b;
}

const clearCMD = "ps aux | grep [n]ode | awk '{print $2}'";
// const clearCMD = "ps aux | grep [f]bi | awk '{print $2}'";
exec(clearCMD, function(childerr, stdout, stderr) {
  console.log('Requested list of PID');
  if (stdout) {
    console.warn('stdout:');
    console.warn(stdout);
    var PIDs = stdout.trim().split(/\W+/);
    var PIDsLen = PIDs.length;
    // PIDs = PIDs.sort();
    PIDs = PIDs.sort(function(a, b) {
      return a - b;
    });
    console.log(PIDs);
    console.log(PIDsLen);
    if (PIDsLen === 0) {
      console.log('No instance running, starting fresh instance!');
    } else {
      var popped = PIDs.pop();
      if (popped) {
        console.log('\nKilling:');
        console.log(PIDs);
      }
      console.log('Popped should still be running:');
      console.log(popped);
    }
  } else {
    console.log('No STDOUT, which means no running processes');
    console.log('No instance running, starting fresh instance!');
  }
  if (childerr) {
    console.warn('childerr:');
    console.warn(childerr);
  }
  if (stderr) {
    console.warn('stderr:');
    console.warn(stderr);
  }
});

// setTimeout(function() {console.log('HI!');}, 10000);
