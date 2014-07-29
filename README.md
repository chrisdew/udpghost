UDP Ghost
=========

A drop-in replacement for dgram.createSocket which uses pcap to clone the packets being received by another process on the same machine.


Scope
-----

This module was written for the following circumstance - if your problem is similar, it may work for you too.

I have an old daemon in production which is accepts UDP traffic, where the source IP address is of vital importance.

I want to test a replacement daemon (written in NodeJS) but cannot bind to the UDP port, as it is already in use by the old daemon.


Solution
--------

UDP Ghost uses libpcap (like tcpdump and Wireshark) to watch all the packets.

UDP Ghost is used exactly like the `dgram` module.

```
var ug = require('../udpghost');

var ghost = ug.createSocket('udp4');
ghost.bind(1234);

ghost.on('message', function(message, rinfo) {
  console.log('ghost message', message);
  console.log('ghost rinfo', rinfo);
});
```

See the example and test directories for more details.

The duplication of the `dgram` API means that the new daemon can just have it's `createSocket` line modded to test in parallel with an existing server.

Note: There must another process already listening to the port to which you udpghost binds, otherwise there is no traffic to listen to. 


Running the Examples
--------------------

For this you will need to checkout the git repo.

You will need three terminals.

T1:
```
$ git clone https://github.com/chrisdew/udpghost
```

To be continued...


Warnings
--------

It is currently in early development, but go ahead and give it a try.


