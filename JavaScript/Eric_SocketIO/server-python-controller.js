// var fs = require('fs-extra');

function incrementStep(io, stepNumber, n, pref) {
  io.emit('step', [stepNumber], pref.statuses[n]);
};

function runPythonScript (script, pyArgs, msgCallback, io, socket) {
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('./scripts/' + script, pyArgs);

    /** Create SIGNINT event on user input */
    socket.on('stop', function() {
      console.log('Stopped Python Script Manually');
      pyshell.childProcess.kill();
    });

    // // sends a message to the Python script via stdin
    // pyshell.send(msg);

    /** React to STDOUT */
    pyshell.on('message', function (message) {
      msgCallback(message, io, socket);
    });

    /**
     * Catch errors or close of script
     */
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

/**
 * Callbacks to simplify action on successful message returned
 */
function startCallback (message, io, socket) {
  var pref = require(__dirname + '/preferences.json');
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
}

function captureCallback (message, io, socket) {
  console.log('Received msg: ' + message);
  io.emit('new-photo', message);
}

function debugCallback (message, io, socket) {
  console.log('Received msg: ' + message);
}


/**
 * Export functions to be called by socket events
 */
module.exports = {
  start: function (io, socket) {
    var pref = require(__dirname + '/preferences.json');
    // Update UI since the process has started:
    incrementStep(io, 1, 1, pref);
    runPythonScript('device_peration.py', {}, startCallback, io, socket);
  },
  capture: function (io, socket) {
    // TODO db and filenames to send as args
    // var pref = require(__dirname + '/preferences.json');
    var pyArgs = {args: ['11.jpg', '111.jpg']};
    runPythonScript('capture.py', pyArgs, captureCallback, io, socket);
  }
};
