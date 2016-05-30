// var fs = require('fs-extra');

function incrementStep(io, stepNumber, n, pref) {
  io.emit('step', [stepNumber], pref.statuses[n]);
};

module.exports = {
  start: function (io, socket) {
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('./scripts/tests.py');
    var pref = require(__dirname + '/preferences.json');

    // Update UI since the process has started:
    incrementStep(io, 1, 1, pref);

    // Respond to SIGINT response from UI
    socket.on('stop', function() {
      console.log('finished PYTHON SCRIPT BRUTLEY');
      pyshell.childProcess.kill();
    });

    /**
     * Start Python Script and respond to stdout
     */

    // // sends a message to the Python script via stdin
    // pyshell.send(msg);

    // Keep up to date with progress of Python script
    pyshell.on('message', function (message) {
      console.log(message);
      var stepNumber = message.slice(-1)*1; // convert to number
      if (message.match('Completed')) {
        // mark the current step complete and the next in progress
        incrementStep(io, stepNumber, 0, pref);
        incrementStep(io, stepNumber + 1, 1, pref);
      } else {
        // Mark the returned step failed
        incrementStep(io, stepNumber, 3, pref);
      }
    });

    // Throw alert on close of python script
    pyshell.on('close', function (err) {
      if (err) {
        throw err;
      }
      console.log('Finished Python Script');
    });
    pyshell.on('error', function (err) {
      throw err;
    });
  },
  capture: function (io, socket) {
// TODO db and filenames to send as args
    var pref = require(__dirname + '/preferences.json');

    /**
     * Start Python Script and respond to stdout
     */

    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('./scripts/capture.py', {
        args: ['1']
      });

    // Keep up to date with progress of Python script
    pyshell.on('message', function (message) {
      console.log(message);
      io.emit('new-photo', message);
    });

    // Throw alert on close of python script
    pyshell.on('close', function (err) {
      if (err) {
        throw err;
      }
      console.log('Finished Python Script');
    });
    pyshell.on('error', function (err) {
      throw err;
    });
  }
};
