// var fs = require('fs-extra');

module.exports = function(app) {
  var PythonShell = require('python-shell');
  var pyshell = new PythonShell('./scripts/tests.py');

  // // sends a message to the Python script via stdin
  // pyshell.send('hello');

  pyshell.on('message', function (message) {
    var db     = require('./database');
    var photos = db.photos;
    photos.loadDatabase();
    var pref   = require('../preferences.json');
    var stepNumber = message.slice(-1)*1; // convert to number
    if (message.match('Completed')) {
      // mark the current step complete and the next in progress
      updatePhotos(photos, stepNumber, 0, pref);
      updatePhotos(photos, stepNumber + 1, 1, pref);


      // require('./routes')(app);
      // app.get('/', function(req, res) {
      //   photos.find({}, function(err, allPhotos) {
      //     // Sort by index (chronological)
      //     allPhotos.sort(function(a, b) {
      //      return a.index - b.index;
      //     });
      //     var imageToShow = allPhotos[0];
      //     res.render('home', {
      //       photo: imageToShow,
      //       standings: allPhotos,
      //       BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL
      //     });
      //   });
      // });

      // app.post('/reload', function(req,res){
      //   console.log('TESTING! RELOAD ROUTE');
      //   res.redirect('../');
      // });

      console.log('app.routes');
    } else {
      // Mark the returned step failed
      updatePhotos(photos, stepNumber, 3, pref);
    }
  });

  // // end the input stream and allow the process to exit
  // pyshell.end(function (err) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log('finished');
  // });

  pyshell.on('close', function (err) {
    if (err) {
      throw err;
    }
    console.log('Finished Python Script');
  });
};

function updatePhotos(db, stepNumber, n, pref) {
  db.update({
    index: stepNumber
  }, {
    $set: {
      status: pref.statuses[n],
      statusMessage: pref.statusMessages[n],
    }
  }, {
    multi: true
  }, function (err, numReplaced) {
    if (err) {
      throw err;
    }
  });
};
