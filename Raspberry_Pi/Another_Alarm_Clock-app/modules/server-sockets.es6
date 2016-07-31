const pref = require('../preferences.json');
const controller = require('./controller.js');

/**
 * Because JS doesn't have MATLAB's 1:6 method
 * Source: http://stackoverflow.com/a/3746752
 */
function range(start, count) {
  if (arguments.length === 1) {
    count = start;
    start = 0;
  }

  const foo = [];
  for (let i = 0; i < count; i++)
    foo.push(start + i);
  return foo;
}

module.exports = {
  start(io) {
    io.on('connection', (socket) => {
      // console.log('a user connected');
      io.emit('BROWSER_REFRESH_URL', process.env.BROWSER_REFRESH_URL);

      /**
       * Respond to Button Events
       */
      socket.on('start', (uniq) => {
        console.log('start uniq');
        console.log(uniq);
        // io.emit('step', [1], [pref.statuses[0]]);
        // require('./server-python-controller.js').start(io, socket);
      });
      socket.on('stop', (uniq) => {
        console.log('stop uniq');
        console.log(uniq);
      });
      socket.on('edit', (uniq) => {
        console.log('edit uniq');
        console.log(uniq);
      });
      socket.on('save', (uniq) => {
        console.log('save uniq');
        console.log(uniq);
        controller.update(io, socket, this.id);
        // io.emit('step', range(1,6), [pref.statuses[2]]);
      });
      socket.on('detele', (uniq) => {
        console.log('detele uniq');
        console.log(uniq);
        controller.delete(io, socket, this.id);
      });
    });
  },
};
