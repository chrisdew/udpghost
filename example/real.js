#!/usr/bin/env node
var dgram = require('dgram');

var dsock = dgram.createSocket('udp4');
dsock.bind(1234);

dsock.on('message', function(message, rinfo) {
  console.log('real message', message);
  console.log('real rinfo', rinfo);
});

