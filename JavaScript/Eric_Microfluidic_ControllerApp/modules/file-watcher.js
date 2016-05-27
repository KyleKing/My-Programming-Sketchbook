// // NEDB Basics:
// var Datastore = require('nedb'), db = new Datastore({filename : 'guitars'});
// db.loadDatabase();

// db.insert({name : "fender jazz bass", year:1977});
// db.remove ({year:1990}, {});

// db.find({year : 1977}, function (err,docs){ console.log(docs); });
// db.update({year : 1977}, {name : "gibson thunderbird", year: 1990}, {});




// // var db       = require('./database');
// // var photos   = db.photos;
// // var chokidar = require('chokidar');

// // // One-liner for current directory, ignores .dotfiles
// // chokidar.watch('.', {ignored: /[\/\\]\./}).on('all', function(event, path) {
// //   console.log(event, path);
// // });


// // // // Example of a more typical implementation structure:

// // // // Initialize watcher.
// // // var watcher = chokidar.watch('file, dir, glob, or array', {
// // //   ignored: /[\/\\]\./,
// // //   persistent: true
// // // });

// // // // Something to use when events are received.
// // // var log = console.log.bind(console);
// // // // Add event listeners.
// // // watcher
// // //   .on('add', path => log(`File ${path} has been added`))
// // //   .on('change', path => log(`File ${path} has been changed`))
// // //   .on('unlink', path => log(`File ${path} has been removed`));

// // // // More possible events.
// // // watcher
// // //   .on('addDir', path => log(`Directory ${path} has been added`))
// // //   .on('unlinkDir', path => log(`Directory ${path} has been removed`))
// // //   .on('error', error => log(`Watcher error: ${error}`))
// // //   .on('ready', function() log('Initial scan complete. Ready for changes'))
// // //   .on('raw', function(event, path, details) {
// // //     log('Raw event info:', event, path, details);
// // //   });

// // // // 'add', 'addDir' and 'change' events also receive stat() results as second
// // // // argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
// // // watcher.on('change', function(path, stats) {
// // //   if (stats) console.log(`File ${path} changed size to ${stats.size}`);
// // // });

// // // // Watch new files.
// // // watcher.add('new-file');
// // // watcher.add(['new-file-2', 'new-file-3', '**/other-file*']);

// // // // Get list of actual paths being watched on the filesystem
// // // var watchedPaths = watcher.getWatched();

// // // // Un-watch some files.
// // // watcher.unwatch('new-file*');

// // // // Stop watching.
// // // watcher.close();
