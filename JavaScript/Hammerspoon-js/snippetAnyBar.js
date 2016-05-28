#!/usr/bin/env node

var dgram = require('dgram'),
    anybarSocket = dgram.createSocket('udp4'),
    message = new Buffer(process.argv[2]);

anybarSocket.send(
  message,
  0,
  message.length,
  process.argv[3] || 1738,
  'localhost',
  function() {
    process.exit();
  }
);
