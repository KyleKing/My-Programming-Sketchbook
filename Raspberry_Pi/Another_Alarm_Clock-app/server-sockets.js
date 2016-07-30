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

    /**
     * Respond to Button Events
     */
    socket.on('start', function(uniq) {
      console.log('start uniq');
      console.log(uniq);
      // io.emit('step', [1], [pref.statuses[0]]);
      // require(__dirname + '/server-python-controller.js').start(io, socket);
    });
    socket.on('stop', function(uniq) {
      console.log('stop uniq');
      console.log(uniq);
    });
    socket.on('edit', function(uniq) {
      console.log('edit uniq');
      console.log(uniq);
    });
    socket.on('save', function(uniq) {
      console.log('save uniq');
      console.log(uniq);
      require(__dirname + '/controller.js').update(io, socket, this.id);
      // io.emit('step', range(1,6), [pref.statuses[2]]);
    });
    socket.on('detele', function(uniq) {
      console.log('detele uniq');
      console.log(uniq);
      require(__dirname + '/controller.js').delete(io, socket, this.id);
    });
    // socket.on('capture', function() {
    //   require(__dirname + '/server-python-controller.js').capture(io, socket);
    // });
  });
};
