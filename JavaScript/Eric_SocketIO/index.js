/**
 * Socket.io Chat demo: http://socket.io/get-started/chat/
 * Start by calling `browser-refresh` or `node index.js`
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/** Configure single route */
// console.log(process.env.NODE_ENV); // development || production
app.set('port', 8080);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));

/** The exciting parts */
io.on('connection', function(socket) {
	// console.log('a user connected');
	io.emit('BROWSER_REFRESH_URL', process.env.BROWSER_REFRESH_URL);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

/**  Get Network Address and create listener: */
// From: https://github.com/nisaacson/interface-addresses
var inspect = require('eyespect').inspector()
var interfaceAddresses = require('interface-addresses')
var addresses = interfaceAddresses()
// inspect(addresses, 'network interface IPv4 addresses (non-internal only)')

http.listen(app.get('port'), function() {
  console.log('listening on ' + addresses.en0 + ':' + app.get('port'));
  // Necessary for browser-refresh
	if (process.send) {
		process.send('online');
	}
});
