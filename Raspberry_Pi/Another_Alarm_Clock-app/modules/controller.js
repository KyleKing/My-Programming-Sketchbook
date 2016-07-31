/**
 * Export functions to be called by socket events
 */
const fs = require('fs-extra');
module.exports = {
  start(io, socket) {
    const pref = fs.readJsonSync(`${__dirname}/preferences.json`);
    // Update UI since the process has started:
    // incrementStep(io, 1, 1, pref);
    // runPythonScript('device_operation.py', {}, startCallback, io, socket);
  },
  update(io, socket, id) {
    console.log('updating!');
    const db = fs.readJsonSync(`${__dirname}/data.js`);
    db.alarms.update({ _id: id }, {
      $set: { name: newName },
    }, { multi: true }, (err, numReplaced) => {
      console.log(`numReplaced: ${numReplaced}`);
    });
  },
  delete(io, socket, id) {
    console.log('DELETING!');
    const db = fs.readJsonSync(`${__dirname}/data.js`);
    db.alarms.update({ _id: id }, {
      $set: { name: newName },
    }, { multi: true }, (err, numReplaced) => {
      console.log(`numReplaced: ${numReplaced}`);
    });
  },
};
