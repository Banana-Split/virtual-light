/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var lights = require('./routes/lights');


var Firebase = require("firebase");


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes defined here 



app.get('/', routes.index);
app.get('/users', user.list);
app.get('/lights', lights.list);


// var myFireBaseRef = new Firebase("ra.firebaseio.com");
var myFireBaseRef = new Firebase("ra.firebaseio.com/devices/virtualbulb");

// myFireBaseRef.set({
//   title: "Hello World!",
//   author: "Andrew",
//   colour: {
//     H: 0,
//     S: 0,
//     V: 0,
//     A: 1,
//     On: false
//   }
// });

// myFireBaseRef.child("alanisawesome").set({
//   date_of_birth: "June 23, 1912",
//   full_name: "Alan Turing"
// });
// myFireBaseRef.child("gracehop").set({
//   date_of_birth: "December 9, 1906",
//   full_name: "Grace Hopper"
// });

// // Updating

// var hopperRef = myFireBaseRef.child("gracehop");
// hopperRef.update({
//   "nickname": "Amazing Grace"
// });

myFireBaseRef.child("colour").update({"H": 123123});


myFireBaseRef.on('value', function(color){
  console.log("I've been changed: ")
  
  var colorOutput = color.val();

  console.log(colorOutput)
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
