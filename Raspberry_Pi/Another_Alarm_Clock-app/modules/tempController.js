/* Copy and pasted workaround for JS
  in JSX: var {name} = require('filename');
  in JS: var name = require('filename').name;
  etc...
 */
var clc = require('cli-color');
var warn = clc.yellow;
// var info = clc.blue;
// var h1 = info.bold;

var debug = require('debug');
if (process.env.DEBUG === 'true') debug.enable('app:*');
/* END: JS workaround */

var tempCont = debug('app:tempCont');

var spawn = require('child_process').spawn;
var PythonShell = require('python-shell');
var Controller = require('node-pid-controller');
var ThingSpeakClient = require('thingspeakclient');

var piblaster = require('pi-blaster.js');
// Available Pins:
// GPIO number   Pin in P1 header
//      4              P1-7
//      17             P1-11
//      18             P1-12
//      21             P1-13
//      22             P1-15
//      23             P1-16
//      24             P1-18
//      25             P1-22
// Example Code
// piblaster.setPwm(17, 1.0 ); // 100% brightness
// piblaster.setPwm(22, 0.2 ); // 20% brightness
// piblaster.setPwm(23, 0 ); // off

/**
 * Set Globals for pyshell callback:
 */

var util = require('./utilities.js');
var client = new ThingSpeakClient({useTimeoutMode: false});
var hotController = {};
var coldController = {};

/**
 * Export this class for general use:
 */

module.exports = {

  /**
   * Configure setup and scoped variables
   */
  init: function () {
    tempCont('Starting tempController');
    this.configureWiring();
    this.powerUp();

    // Connect to Thingspeak:
    this.thingspeakkey = require(__dirname + '/../thingspeakkey.json');
    tempCont('>> Thingspeak Keys: channel: ' + this.thingspeakkey.channel +
      ' write: ' + this.thingspeakkey.write +
      ' read: ' + this.thingspeakkey.read);
    tempCont('Configuring Thingspeak');
    client.attachChannel(this.thingspeakkey.channel, {
      writeKey: this.thingspeakkey.write,
      readKey: this.thingspeakkey.read
    });

    // Start thermocouple-reading python script
    var pyScript = this.set.scripts.read_thermocouple;
    if (process.env.LOCAL === 'true')
      pyScript = this.set.scripts.fake_thermocouple;
    else if (process.env.MELTER === 'true')
      pyScript = this.set.scripts.single_thermocouple;
    var pyshell = new PythonShell(pyScript, function (err) {
      if (err) throw err;
    });
    pyshell.on('message', this.monitor);
  },

  /**
   * Configure MOSFET wiring
   */
  configureWiring: function () {
    // Configure Hot and Cold Mosfet Pins
    this.set = require(__dirname + '/../settings.json');
    var wir = this.set.wiring;
    process.env.HotFET = wir[wir.Hot + 'FET'];
    process.env.ColdFET = wir[wir.Cold + 'FET'];
    tempCont('>> Wiring Config: HotFET: ' + process.env.HotFET +
      ' ColdFET: ' + process.env.ColdFET);
    this.configurePID();
  },

  /**
   * Configure PID Algorithm
   */
  configurePID: function () {
    // Determine if running Melter or DualStage program:
    var HotPID = this.configureHotPID();
    if (process.env.MELTER === 'true') {
      hotController.setTarget(this.set.PID.MELTER.target); // °C
      tempCont('Single Melting Stage is Heating to ' +
        this.set.PID.MELTER.target + '°C');
    } else {
      hotController.setTarget(HotPID.target); // °C
      this.configureColdPID();
    }
  },
  configureColdPID: function () {
    var ColdPID = this.set.PID.Cold;
    tempCont('>> Cold PID controller: Kp: ' + ColdPID.kp + ' Kd: ' +
      ColdPID.kd + ' Ki: ' + ColdPID.ki);
    coldController = new Controller(ColdPID.kp, ColdPID.ki,
      ColdPID.kd, ColdPID.dt);
    coldController.setTarget(ColdPID.target); // °C
    return ColdPID;
  },
  configureHotPID: function () {
    var HotPID = this.set.PID.Hot;
    tempCont('>> Hot PID controller: Kp: ' + HotPID.kp + ' Kd: ' + HotPID.kd +
      ' Ki: ' + HotPID.ki);
    hotController = new Controller(HotPID.kp, HotPID.ki,
      HotPID.kd, HotPID.dt);
    return HotPID;
  },

  /**
   * Power up the heating elements
   */
  powerUp: function () {
    if (process.env.LOCAL === 'true')
      console.log(warn('\nNot on a Raspberry Pi, so skipping MOSFET code\n'));
    else if (process.env.MONITOR === 'false') {
      console.log(warn('\n****Powering up some pins, watch out.****\n'));
      spawn('sh', [this.set.scripts.start_Pi_Blaster]);
      // piblaster.setPwm(this.FanFET, 0.9);
      tempCont('Done: Powering Up Mosfet Control');
    } else this.powerDown();
  },

  /**
   * Power up the heating elements
   */
  powerDown: function () {
    console.log(warn('\nPowering down now!\n'));
    piblaster.setPwm(this.set.wiring.RightFET, 0);
    piblaster.setPwm(this.set.wiring.MiddleFET, 0);
    piblaster.setPwm(this.set.wiring.LeftFET, 0);
  },

  /**
   * Realtime temperature updates
   */
  monitor: function (message) {
    var parse = util.parseMessage(message);

    // Make appropriate changes
    var hotCorrection = hotController.update(parse.hotExternal),
        hotClipped = util.clipCorrection(hotCorrection),
        hotPWM = hotClipped.correction;
    console.log('H: ' + hotClipped.color(parse.hotExternal+'°C') +
      ' and H(i): ' + hotClipped.color(parse.hotInternal+'°C') );

    var coldPWM = 0;
    if (process.env.MELTER === 'false') {
      var coldCorrection = coldController.update(parse.coldExternal),
          coldClipped = util.clipCorrection(coldCorrection);
      coldPWM = coldClipped.correction;
      console.log('C: ' + coldClipped.color(parse.coldExternal+'°C') +
        ' and C(i): ' + coldClipped.color(parse.coldInternal+'°C') );
    }

    util.updateThingspeakAPI(client, parse.hotExternal, hotPWM,
      parse.coldExternal, coldPWM);

    if (process.env.MONITOR === 'false' && process.env.LOCAL === 'false') {
      piblaster.setPwm(process.env.HotFET, hotPWM);
      if (process.env.MELTER === 'false')
        piblaster.setPwm(process.env.ColdFET, coldPWM);
    }
  }
};
