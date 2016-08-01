/**
 * initialize debugger
 */

const clc = require('cli-color');
const debug = require('debug');
const fs = require('fs');

module.exports = {
  error: clc.red.bold,
  warn: clc.yellow,
  info: clc.blue,
  ignore: clc.xterm(8),
  init: (app) => {
    if (process.env.DEBUG === 'true') debug.enable('app:*');
    return debug(`app:${app}`);
  },
  existsSync(filename) {
    try {
      fs.accessSync(filename);
      return true;
    } catch (ex) {
      return false;
    }
  },
  exists(filename, cb) {
    fs.access(filename, cb);
  },
};
