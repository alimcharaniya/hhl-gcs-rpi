var can = require('rawcan');
var telemetry = require('./telemetry.js');
var canSocket = can.createSocket('can0');
var serverAddress = ('http://192.168.0.13:8080');
var ws = require('socket.io-client');
var io = ws.connect(serverAddress);
var Stopwatch = require('timer-stopwatch');

var timer = new Stopwatch(3000); //start a 3 stop watch 

timer.onTime(function(time){
   console.log(time.ms);
})

timer.onDone(function(){
   console.log("NETWORK TIMEOUT - ACTUATE BRAKES");
})

io.on('connect',function(data){
   console.log("Client connected to server. Verify on server machine");
   timer.start(); 
   io.on("ping",function(){
      timer.stop();
      timer.reset(3000) //when pinged, reset timer
      timer.start();
      console.log("pinged!");
      io.emit("pong-back");
   })
})




//If can bus socket throws error, print the error
canSocket.on('error', err => {console.log('socket error: ' + err);});

//print all frames in raw id + buffer format 
canSocket.on('message', (id, buffer) => {
	console.log('got frame: ' + id.toString(16) +"buffer: " + buffer.toString('hex'));
	//canSocket.send(86, 'hello');
	console.log("after message");
		 
});

console.log("program compiled..listening..");

