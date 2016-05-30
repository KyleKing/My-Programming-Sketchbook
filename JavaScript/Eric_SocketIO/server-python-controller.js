// var fs = require('fs-extra');

function incrementStep(io, stepNumber, n, pref) {
  io.emit('step', [stepNumber], pref.statuses[n]);
};

module.exports = {
  start: function (io, socket) {
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('./scripts/tests.py');
    var pref = require(__dirname + '/preferences.json');
    // Alert user that process is started:
    incrementStep(io, 1, 1, pref);

    /** FIXME: NOT WORKING, python script carries on happily */
    socket.on('stop', function() {
      console.log('stopping in python script!');
      pyshell.end(function (err) {
        if (err) {
          throw err;
        }
        console.log('finished PYTHON SCRIPT BRUTLEY');
      });
    });

    // // sends a message to the Python script via stdin
    // process.env.pyshell.send('hello');

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
  },

  stop: function(io) {
    console.log('NOT WORKING');
    // end the input stream and allow the process to exit

  }
};
