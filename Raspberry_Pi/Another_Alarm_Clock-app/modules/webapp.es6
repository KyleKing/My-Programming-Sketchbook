/**
 * Based on Socket.io Chat demo: http://socket.io/get-started/chat/
 * Start by calling `browser-refresh` or `node index.js`
 */

const express = require('express');
const app = express();
const http = require('http').Server(app); // eslint-disable-line
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
const fs = require('fs-extra');

const interfaceAddresses = require('interface-addresses');
const addresses = interfaceAddresses();
const inspect = require('eyespect').inspector();

/**
 * Configure App
 */

const db = require('./data.es6');
const serverSocket = require('./server-sockets.es6');
module.exports = {
  start(rootPath) {
    app.set('port', 8080);
    app.use(express.static(`${rootPath}/public`));

    // Configure Templates and Routes
    app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

    const alarms = db.alarms;
    alarms.find({}, (err, allAlarms) => {
      // // Sort by index (chronological)
      // allSteps.sort(function(a, b) {
      //  return a.index - b.index;
      // });
      app.get('/', (req, res) => {
        res.render('home', {
          alarmList: allAlarms,
          BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL,
        });
      });
    });

    /**
     * The exciting parts - listen to and respond to user events
     */
    serverSocket.start(io);

    /**
     * Get Network Address and create listener
     * From: https://github.com/nisaacson/interface-addresses
     */
    http.listen(app.get('port'), () => {
      // Filter through possible IP addresses
      let nIP = '';
      if (addresses.en0)
        nIP = addresses.en0;
      else if (addresses.en1)
        nIP = addresses.en1;
      else if (addresses.wlan0)
        nIP = addresses.wlan0;
      else if (addresses.eth0)
        nIP = addresses.eth0;
      else {
        nIP = 'check address manually';
        inspect(addresses, 'network interface IPv4 addresses (non-internal)');
      }
      console.log(`listening on ${nIP}:${app.get('port')}`);

      // Necessary for browser-refresh
      if (process.send)
        process.send('online');
    });
  },
};
