var can = require('rawcan');
var canSocket = can.createSocket('can0');
var serverAddress = ('http://192.168.0.13:8080');

var socketIO = require('socket.io-client');
var io = socketIO.connect(serverAddress)

var Stopwatch = require('timer-stopwatch');

//Constants 
const SERVER_ADDRESS_STRING = 'http://192.168.0.13:8080'; //IP of host machine 
const NETWORK_TIMEOUT_TIME = 3000;  //milliseconds 

//Pod states 
var CURRENT_POD_STATE = "NOT INIT";

//MC Connection Boolean 
var canHearMC = false; 
var clientCount = 0; 

var POD_STATES = {
   1 : "PRE-FLIGHT STANDBY",
   2 : "PUSHER-INTERLOCK",
   3 : "RUN-MODE WITHOUT HOVER",
   4: "RUN-MODE WITH HOVER",
   5: "RUN-MODE COASTING",
   6: "ABORT",
   7: "BRAKING",
   8: "FINAL-DECELERATION",
   9: "STOPPED",
   10: "FAULT"
}

//A timer 
var timer = new Stopwatch(NETWORK_TIMEOUT_TIME); //start a 3 stop watch 

timer.onTime(function(time){
   console.log(time.ms);
})

io.on('connect',function(data){
   clientCount++;
   canHearMC = false; //if we reconnect
   canSocket.send(100, "send test"); //Ping Microcontroller 

   console.log("Client connected to server. Verify on server machine");
   console.log("Total clients connected: " + clientCount);
   canSocket.send(100, "send test"); //Ping Microcontroller 

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

io.on('disconnect', function(){
   clientCount--; 
   console.log("A client has disconnected.");
   console.log("Total clients connected: " + clientCount);
})

////////////////////////////////
/// CAN BUS EVENT LISTENERS ///
///////////////////////////////


//Error?
canSocket.on('error', err => {console.log('socket error: ' + err);});

//Print all frames in raw id + buffer format 
canSocket.on('message', (id, buffer) => {
	console.log('got frame: ' + id.toString(16) +"buffer: " + buffer.toString('hex'));
   var bufferString = buffer.toString(); 

   switch(bufferString){
      case '':
         return;
      default: 
         console.log()
         return;
   }
   
});

////////////////////////////////
///  FUNCTION DECLARATIONS   ///
///////////////////////////////

function ponged(){
 console.log("CAN response to PING")
 canHearMC = true; 
}

//Print compilation success..
console.log("program compiled..listening..");

