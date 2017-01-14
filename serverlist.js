//var PORT = 11005;
var PORT = 11005;
var HOST = '52.4.112.98';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var pad_array = function(arr,len,fill) {
  return arr.concat(Array(len).fill(fill)).slice(0,len);
}

client.on('listening', function () {
    var address = client.address();
    clientPort = address.port;
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

client.on('message', function (message, remote) {

    console.log(message);
    
    // expected response: [0a:00:ff:ff:00:fe:fe:fe:fe:fd:fd:fd:fd:12:34:56:78:00:05:46:(addl info for 11 bytes):(???? to 1464 bytes padded 0's]
    // Note the ????'s above. The last 2 bytes are different for some reason. 8bit number? unlikely so probably 2 separate numbers for some reason.
    // Maybe it doesn't matter? Doing more testing.
    
    if (message.slice(0, 20).equals(new Buffer([0x0a,0x00,0xff,0xff,0x00,0xfe,0xfe,0xfe,0xfe,0xfd,0xfd,0xfd,0xfd,0x12,0x34,0x56,0x78,0x00,0x05,0x46]))) {
      console.log('got response');
    }
});

// Ask for server list. This is static and never changes.
var message = new Buffer(pad_array([0x09,0x0b,0x00,0x00,0x00,0x00,0x5c,0xd1,0x87,0x38,0x00,0xff,0xff,0x00,0xfe,0xfe,0xfe,0xfe,0xfd,0xfd,0xfd,0xfd,0x12,0x34,0x56,0x78,0xcb,0xfb,0x8f,0x9d,0x2a,0xfd], 1464, 0));

console.log(message.length);

client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {

    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);

});