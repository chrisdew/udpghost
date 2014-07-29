#!/usr/bin/env node
var ug = require('../udpghost');

var ghost = ug.createSocket('udp4');
ghost.bind(1234);

ghost.on('message', function(message, rinfo) {
  console.log('ghost message', message);
  console.log('ghost rinfo', rinfo);
});

