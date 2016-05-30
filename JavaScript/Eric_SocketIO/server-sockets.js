// // Load all images from photos folder to match with known list of steps:
// var Datastore = require('nedb');
// var fs        = require('fs');

// var photos = new Datastore({
//  filename: __dirname + '/../data/photos',
//  autoload: true
// });

// // Configure the database on filenames and existence of image
// photos.ensureIndex({fieldName: 'name', unique: true});
// var photosOnDisk = fs.readdirSync(__dirname + '/../public/photos');

// pref.steps.forEach(function(step, index){
//  var stepIdx = index+1, photoName = stepIdx + '.jpg';
//  var found = photosOnDisk.indexOf(photoName) !== -1 ? true : false;
//  var status = pref.statuses[2], statusMes = pref.statusMessages[2];
//  // Insert the curated options
//  photos.insert({
//    name: photoName,
//    found: found,
//    title: 'Step '+stepIdx+': '+step,
//    status: status,
//    statusMessage: statusMes,
//    index: stepIdx
//  });
// });

// module.exports = {
//  photos: photos
// };

var pref = require(__dirname + '/preferences.json');

/**
 * Because JS doesn't have MATLAB's 1:6 method
 * Source: http://stackoverflow.com/a/3746752
 */
function range(start, count) {
  if (arguments.length === 1) {
    count = start;
    start = 0;
  }

  var foo = [];
  for (var i = 0; i < count; i++) {
    foo.push(start + i);
  }
  return foo;
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    // console.log('a user connected');
    io.emit('BROWSER_REFRESH_URL', process.env.BROWSER_REFRESH_URL);

    /** respond to button presses on client */
    socket.on('start', function() {
      io.emit('step', [1], [pref.statuses[0]]);
      require(__dirname + '/server-python-controller.js').start(io, socket);
      console.log('start!');
    });
    socket.on('stop', function() {
      // if (process.env.pyshell) {}
      require(__dirname + '/server-python-controller.js').stop(io);
      io.emit('step', range(1,6), [pref.statuses[2]]);
      console.log('stop!');
    });
  });
};
