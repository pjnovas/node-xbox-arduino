
/*
 * Run this process with sudo
 *
 * If you get an exit with code 0, is probably because xboxdrv is already running
 * So kill the process before running this code
 * How to kill?:
 *  ps |grep xbox
 *  get the pid and run
 *  kill -9 pid
 */

var xbox = require('node-xboxdrv');

// To get the Control run: lsusb
// Bus 002 Device 002: ID [pid]:[vid] Xbox Controller
// i.e. Bus 003 Device 003: ID 045e:0719

var pid = "045e";
var vid = "0719";

var controller = new xbox(pid, vid, {
  "type": "xbox360-wireless", // Currently only Xbox 360 controllers are supported. See http://pingus.seul.org/~grumbel/xboxdrv/xboxdrv.html
  "deadzone": 3000
});

// Lets get arduino
// Start Arduino IDE > File > Examples > Firmata > StandardFirmata
// Upload to Arduino

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  console.log('Arduino READY!');

  var led = new five.Led(13);
  var servo = new five.Servo(10);

  var axe = {
    max: 32767,
    min: -32767
  };

  controller.on('a',function(){
    console.log('Pressed A');
    led.on();
  });

  controller.on('b',function(){
    console.log('Pressed B');
    led.off();
  });

  controller.on('leftX',function(pos){
    console.log("left X: " + pos);
    var p = (pos*180)/axe.max;
    servo.to(p);
  });

});


var cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
