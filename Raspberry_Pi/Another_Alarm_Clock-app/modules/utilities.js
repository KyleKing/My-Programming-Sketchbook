/* Copy and pasted workaround for JS
  in JSX: var {name} = require('filename');
  in JS: var name = require('filename').name;
  etc...
 */
var clc = require('cli-color');
// var warn = clc.yellow;
var info = clc.blue;
var h1 = info.bold;

var debug = require('debug');
if (process.env.DEBUG === 'true') debug.enable('app:*');
/* END: JS workaround */
var utilityDebug = debug('app:utility');

module.exports = {
  // Convert the PID values to digital logic
  clipCorrection: function (rawCorrection) {
    var correction = rawCorrection;
    var color = clc.white;
    if (correction > 0) {
      correction = 1;
      color = clc.red;
    }
    if (correction <= 0) {
      correction = 0;
      color = clc.blue;
    }
    console.log('   Raw PID: ' + rawCorrection.toPrecision(2) +
      ' and Clipped PWM value: ' + correction.toPrecision(2));
    return {
      correction: correction,
      color: color
    };
  },

  // Parse incoming messages from the Python script
  parseMessage: function (message) {
    utilityDebug('Starting Monitor Function');
    var message = message.trim().split(',');
    if (process.env.MELTER === 'true') {
      message[2] = '0';
      message[3] = '0';
    }
    console.log('-----------------------------------');
    return {
      'hotExternal': message[0].trim(),
      'hotInternal': message[1].trim(),
      'coldExternal': message[2].trim(),
      'coldInternal': message[3].trim()
    };
  },

  /**
   * Update Thingspeak dashboard for realtime charts
   * (Note: API rate limit imposed by NPM module)
   */
  updateThingspeakAPI: function (client, hotExternal, hotPWM,
    coldExternal, coldPWM) {
    var thingspeakkey = require(__dirname + '/../thingspeakkey.json');
    var dataset = {
      field1: hotExternal,
      field2: hotPWM
    };
    if (process.env.MELTER === 'false')
      dataset = {
        field1: hotExternal,
        field2: hotPWM,
        field3: coldExternal,
        field4: coldPWM
      };
    utilityDebug('Sent "dataset" to Thingspeak:');
    utilityDebug(dataset);
    client.updateChannel(thingspeakkey.channel, dataset, function(err, resp) {
      if (err) throw err;
      if (!err && resp > 0)
        console.log(h1('\n** Sent Last Data Point to Thingspeak. ' +
          'Entry number was: '+resp+'\n'));
    });
  }
};
