var can = require('rawcan');
var socket = can.createSocket('can0');


function sendEmergencyStop(){
socket.send(0x121, 'STOP');
}



socket.on('error', err => {console.log('socket error: ' + err);});


socket.on('message', (id, buffer) => {
	console.log('got frame: ' + id.toString(16) +"buffer: " + buffer.toString('hex'));
	socket.send(86, 'hello');
	console.log("after message");
		 
});


