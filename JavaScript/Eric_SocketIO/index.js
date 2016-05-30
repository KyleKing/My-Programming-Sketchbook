/**
 * Socket.io Chat demo: http://socket.io/get-started/chat/
 * Start by calling `browser-refresh` or `node index.js`
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exphbs  = require('express-handlebars');
var fs = require('fs-extra');

/**
 * Configure App
 */

app.set('port', 8080);
app.use(express.static(__dirname + '/public'));
// console.log(process.env.NODE_ENV); // development || production

// Configure Templates and Routes
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var db = require(__dirname + '/data.js');
var photos = db.photos;
photos.find({}, function(err, allPhotos) {
  // Sort by index (chronological)
  allPhotos.sort(function(a, b) {
   return a.index - b.index;
  });
  // Store the photos data in a local JSON file to be read by the
  // HandleBars Template to allow server-side rendering
  fs.writeJson('./data-sync.json', allPhotos, function (err) {
    if (err) {
      console.log(err);
    }
  });
  // console.log(allPhotos);
});

var dataSync = require('./data-sync.json');

// var hbs = require(__dirname + '/helpers.js')(exphbs);
app.get('/', function (req, res) {
  res.render('home', {
    photo: dataSync[2],
    stepList: dataSync,
    BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL
  });
});

/**
 * The exciting parts - listen to and respond to user events
 */
require(__dirname + '/server-sockets.js')(io);

/**
 * Get Network Address and create listener
 * From: https://github.com/nisaacson/interface-addresses
 */
var interfaceAddresses = require('interface-addresses');
var addresses = interfaceAddresses();
var inspect = require('eyespect').inspector();
http.listen(app.get('port'), function() {
  // Filter through possible IP addresses
  var nIP = '';
  if (addresses.en0) {
    nIP = addresses.en0;
  } else if (addresses.en1) {
    nIP = addresses.en1;
  } else if (addresses.eth0) {
    nIP = addresses.eth0;
  } else {
    nip = 'check address manually';
    inspect(addresses, 'network interface IPv4 addresses (non-internal)');
  }
  console.log('listening on ' + nIP + ':' + app.get('port'));
  // Necessary for browser-refresh
  if (process.send) {
    process.send('online');
  }
});
