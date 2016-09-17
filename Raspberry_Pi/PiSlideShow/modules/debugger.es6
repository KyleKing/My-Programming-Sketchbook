/**
 * initialize debugger
 */

const clc = require('cli-color');
const debug = require('debug');

module.exports = {
  error: clc.red.bold,
  warn: clc.yellow,
  info: clc.blue,
  ignore: clc.xterm(8),
  init: (app) => {
    if (process.env.DEBUG === 'true') debug.enable('app:*');
    return debug(`app:${app}`);
  },
};
