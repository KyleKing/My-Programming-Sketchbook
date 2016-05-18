// // Node Child Processes
// // Demo of starting and stopping such programs

// // Exec version
// // https://docs.nodejitsu.com/articles/child-processes/how-to-spawn-a-child-process/
// var childProcess = require('child_process');

// var ls = childProcess.exec('ls -l', function (error, stdout, stderr) {
//   if (error) {
//     console.log(error.stack);
//     console.log('Error code: '+error.code);
//     console.log('Signal received: '+error.signal);
//   }
//   console.log('Child Process STDOUT: '+stdout);
//   console.log('Child Process STDERR: '+stderr);
// });

// ls.on('exit', function (code) {
//   console.log('Child process exited with exit code '+code);
// });

// // Child version
// http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn

var exec = require('child_process').exec;
var child = exec('bash process.bash');

child.stdout.on('data', function(data) {
  console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
  console.log('stdout: ' + data);
});
child.on('close', function(code) {
  console.log('closing code: ' + code);
});

// Delay and killing sub-process
var kill = require('tree-kill');
var bashProcess = child.pid;
setTimeout(function() {
  kill(bashProcess, 'SIGTERM', function(err) {
    if (err) console.log('SIGTERM err: ' + err);
  });
}, 3000);


