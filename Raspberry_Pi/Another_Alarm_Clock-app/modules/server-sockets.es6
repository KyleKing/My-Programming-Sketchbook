// const fs = require('fs-extra');
// const pref = fs.readJsonSync('../preferences.json');
const controller = require('./controller.js');
const { alarms } = require('./data.es6');

// /**
//  * Because JS doesn't have MATLAB's 1:6 method
//  * Source: http://stackoverflow.com/a/3746752
//  */
// function range(start, count) {
//   if (arguments.length === 1) {
//     count = start;
//     start = 0;
//   }

//   const foo = [];
//   for (let i = 0; i < count; i++)
//     foo.push(start + i);
//   return foo;
// }

module.exports = {
  start(io) {
    io.on('connection', (socket) => {
      // console.log('a user connected');
      io.emit('BROWSER_REFRESH_URL', process.env.BROWSER_REFRESH_URL);

      /**
       * Respond to Client Events
       */
      socket.on('start', (uniq) => {
        this.updateAlarm(uniq, 'started', true);
      });
      socket.on('stop', (uniq) => {
        this.updateAlarm(uniq, 'started', false);
      });
      socket.on('edit', (uniq) => {
        this.updateAlarm(uniq, 'started', false);
      });
      socket.on('edit', (uniq, params) => {
        // params must be tru/fal
        this.updateAlarm(uniq, 'edited', params);
      });
      socket.on('save', (uniq, params) => {
        // params must be tru/fal
        this.updateAlarm(uniq, 'edited', params);
      });
      socket.on('remove', (uniq) => {
        console.log('Removing ${uniq}');
        alarms.remove({ uniq }, {}, (error, numRemoved) => {
          if (error) throw new Error(error);
          console.log(numRemoved);
        });
        alarms.persistence.compactDatafile();
      });
    });
  },

  updateAlarm(uniq, param, newValue) {
    alarms.find({ uniq }, (err, docs) => {
      if (err) throw new Error(err);
      docs.forEach((doc) => {
        const newDoc = doc;
        newDoc[param] = newValue;
        alarms.update({ uniq }, newDoc, {});
        if (param === 'edited') {
          console.log('Not yet supported - more than one param');
          console.log(doc);
        } else {
          console.log('Normal operation - Mostly Works');
          console.log(doc);
        }
      });
    });
  },
};
