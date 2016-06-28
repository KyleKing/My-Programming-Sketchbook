/* initialize debugger */
// import { error, warn, info, ignore, init } from './debugger.es6';
import { init } from './debugger.es6';
const utilDebug = init('util');

const fs = require('fs-extra');

module.exports = {

  /**
   * Shortcut to check if file/dir exists
   */
  checkFS(file, callback) {
    fs.access(file, fs.R_OK | fs.W_OK, (err) => {
      utilDebug(`Checking access to: ${file}`);
      if (err)
        if (err.errno === -2) callback(err);
        else console.error(err);
    });
  },

};
