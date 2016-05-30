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
    socket.on('start', function() {
      io.emit('step', [1], [pref.statuses[0]]);
      require(__dirname + '/server-python-controller.js').start(io, socket);
    });
    socket.on('stop', function() {
      io.emit('step', range(1,6), [pref.statuses[2]]);
    });
    socket.on('capture', function() {
      require(__dirname + '/server-python-controller.js').capture(io, socket);
    });
  });
};
