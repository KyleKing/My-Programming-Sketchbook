var debug = require('debug');
if (process.env.DEBUG === 'true') debug.enable('app:*');
var pumpCont = debug('app:pumpCont');
var serialport = require('serialport');
var serialPort = {};

module.exports = {

  /**
   * Find the port of the Chemyx pump
   */
  init: function() {
    var ports = [];
    serialport.list(function (err, ports) {
      ports.forEach(function(port) {
        console.log(port);
        // console.log('port.comName: ' + port.comName);
        // console.log('port.productId: ' + port.productId);
        // console.log(port.locationId);
        // console.log(port.vendorId);
        console.log('---------port-parser break---------');

        // Check if Chemyx Pump:
        if (port.productId === '0x6001') {
          pumpCont(port.comName);
          ports.push(port.comName);
          // this.createConnection(port.comName);
          // i.e. '/dev/cu.usbserial-AM020D9R'
        }
      });
    });
    return ports;
  },

  /**
   * Using discovered port start reading/writing to the Chemyx pump!
   */
  createConnection: function (currentPort) {
    pumpCont('currentPort is ' + currentPort);

    var SerialPort = serialport.SerialPort; // localize object constructor
    serialPort = new SerialPort(currentPort, {
      baudrate: 9600,
      parser: serialport.parsers.readline('\n')
    });

    serialPort.on('open', function () {
      pumpCont('\nSerialPort is open with rate of ' +
        serialPort.options.baudRate+'\n');
    });

    // serialPort.on('data', function(data) {
    //   console.log('Received data, how exciting!');
    //   pumpCont(data);
    //   data.split(' = ').forEach(function(value) {
    //     console.log(value);
    //   });
    //   ////////////////////////////
    //   /// Put your callbacks here
    //   ////////////////////////////
    // });

    serialPort.on('close', function() {
      console.warn('Port Closed');
    });
    return serialPort.on('error', function(error) {
      throw new Error('Serial Port Error: ' + error);
    });
    return serialPort;
  },

  start: function (serialPort) {
    serialPort.write('start\r');
  },
  pause: function (serialPort) {
    serialPort.write('pause\r');
  },
  stop: function (serialPort) {
    serialPort.write('stop\r');
  },

  /**
   * Get list of available commands:
   */
  help: function (serialPort) {
    serialPort.write('help\r', function(err, results) {
      if (err) throw new Error(err);
      console.log('response from "help"');
      console.log(results);
    });
  },

  /**
   * Get current pump parameters:
   */
  parseParameters: function (serialPort) {
    serialPort.write('view parameters\r', function(err, results) {
      if (err) throw new Error(err);
      // Parse result of pump parameters
      console.log('response from "view parameters"');
      console.log(results);
      results.split(' ').forEach(function(element) {
        console.log(element);
      });
    });
  },

  /**
   * Update or leave constant Syringe Pump values
   * update(serialPort, {
   *   diameter: 4.78,
   *   rate: 1.0,
   *   volume: 1.0,
   *   delay: 0
   * })
   */
  update: function (serialPort, args) {
    // var diameter = 'set diameter ' + args.diameter + '\r' || '';
    var diameter = 'set diameter ' + args.diameter + '\r' || '';
    var rate = 'set rate ' + args.rate + '\r' || '';
    var volume = 'set volume ' + args.volume + '\r' || '';
    var delay = 'set delay ' + args.delay + '\r' || '';

    serialPort.write(diameter + rate + volume + delay + 'start\r',
      function(err, results) {
      if (err) throw new Error(err);
      console.log('results ' + results);
    });
  }

};
