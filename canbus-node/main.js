var can = require('rawcan');
var Telemetry = require('./telemetry.js');
var canSocket = can.createSocket('can0');
var serverAddress = ('http://192.168.0.13:8080');
var ws = require('socket.io-client');
var io = ws.connect(serverAddress);
var Stopwatch = require('timer-stopwatch');


//Constants 

const SERVER_ADDRESS_STRING = 'http://192.168.0.13:8080'; //IP of host machine 
const NETWORK_TIMEOUT_TIME = 3000;  //milliseconds 

//Pod states 
var CURRENT_POD_STATE = "NOT INIT";



//A timer 
var timer = new Stopwatch(NETWORK_TIMEOUT_TIME); //start a 3 stop watch 

timer.onTime(function(time){
   console.log(time.ms);
})

function ponged(){
 console.log("CAN response to PING")
}


io.on('connect',function(data){

   console.log("Client connected to server. Verify on server machine");

   canSocket.send(100, "send test");

   //timer.start(); 

   io.on("ping",function(){
      timer.stop();
      timer.reset(3000) //when pinged, reset timer
      timer.start();
      console.log("pinged!");
      io.emit("pong-back");
   })

   io.on("emergencyStop", function(){
      console.log("EMERGENCY STOP TRIGGERED");
      currentState = "STOPPING...";  
   })


   //Timer 
   timer.onDone(function(){
      console.log("NETWORK TIMEOUT - Trying to reconnect...");   
   })
})

////////////////////////////////
/// CAN BUS EVENT LISTENERS ///
///////////////////////////////


//Errors?
canSocket.on('error', err => {console.log('socket error: ' + err);});

//Print all frames in raw id + buffer format 
canSocket.on('message', (id, buffer) => {
	console.log('got frame: ' + id.toString(16) +"buffer: " + buffer.toString('hex'));
	//canSocket.send(86, 'hello');
	console.log("after message");
	if (buffer.toString() == 'pong'){
           ponged(); 
	} else {

        }
});




console.log("program compiled..listening..");

