/**
 * Socket.io Chat demo: http://socket.io/get-started/chat/
 * Start by calling `browser-refresh` or `node index.js`
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exphbs  = require('express-handlebars');

/** Configure single route */
app.set('port', 8080);
app.use(express.static(__dirname + '/public'));
// console.log(process.env.NODE_ENV); // development || production

/** Render Handlebars Templates */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.get('/', function (req, res) {
    res.render('home');
});

/** The exciting parts - listen to and respond to user events */
require(__dirname + '/server-sockets.js')(io);

/**
 * Get Network Address and create listener
 * From: https://github.com/nisaacson/interface-addresses
 */
var interfaceAddresses = require('interface-addresses');
var addresses = interfaceAddresses();
// var inspect = require('eyespect').inspector();
// // inspect(addresses, 'network interface IPv4 addresses (non-internal only)')
http.listen(app.get('port'), function() {
  console.log('listening on ' + addresses.en0 + ':' + app.get('port'));
  // Necessary for browser-refresh
  if (process.send) {
    process.send('online');
  }
});
