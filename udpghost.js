exports.createSocket = createSocket;

var util = require('util')
  , stream = require('stream')
  , pcap = require('pcap')
  , events = require('events')
  , os = require('os')
  ;

function createSocket(type, callback) {
  if (type !== 'udp4') {
    throw 'udpghost only supports udp4';
  }
  return new Socket(callback);
}

function Socket(callback) {
  if (callback) this.on('message', callback);
}
util.inherits(Socket, events.EventEmitter);

Socket.prototype.bind = function(port, address, callback) {
  this.port = port;
  this.addr = address ? address : '0.0.0.0';
  if (callback) this.on('listening', callback);
  pcap_session = pcap.createSession('any', 'udp port ' + port);
  var that = this;
  pcap_session.on('packet', function(raw) {
    //console.log('message', packet);
    var packet = pcap.decode.packet(raw);
    var msg = packet.link.ip.udp.data;
    var rinfo = { 
      address: packet.link.ip.saddr,
      family: 'IPv4',
      port: packet.link.ip.udp.sport,
      size: msg.length
    }; 
    if (localIpv4Addresses().indexOf(packet.link.ip.daddr) >= 0) {
      that.emit('message', msg, rinfo);
    } else {
      console.log('outgoing message seen', msg, rinfo, packet.link.ip);
    };
  }); 
  this.emit('listening');
}

Socket.prototype.address = function() {
  var linfo = {
    address: this.addr,
    family: 'IPv4',
    port: this.port
  };
  return linfo;
}

Socket.prototype.send = function() {
  console.log('not sending:', arguments);
}

function localIpv4Addresses() {
  var addrs = [];
  var ifaces = os.networkInterfaces();
  for (var nicname in ifaces) {
    for (var i in ifaces[nicname]) {
       var rec = ifaces[nicname][i];
       if (rec.family == 'IPv4') {
         addrs.push(rec.address);
       }
    }
  } 
  return addrs;
};
