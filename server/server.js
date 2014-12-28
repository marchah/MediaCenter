// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');

var app      = express();
var port     = process.env.PORT || 5060;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// set global variables
global.PATH_API	= __dirname;
//var Channel	= require(global.PATH_API + '/app/models/channel');
//Channel.find({}, function(err, listChannel) {
  //  global.listChannel = listChannel;
//		    console.log(listChannel);
//    global.listChannel = new Array();

//    listChannel.forEach(function(channel) {
//	global.listChannel.push(channel.toObject());
//	console.log(global.listChannel.indexOf('542f2b0976c5ebb34b5549ac'));
//	console.log(channel.toObject());
//    });
//});


require('./config/passport')(passport); // pass passport for configuration
/*
app.use("/js", express.static(__dirname + "/../public/js"));
app.use("/img", express.static(__dirname + "/../public/img"));
app.use("/css", express.static(__dirname + "/../public/css"));
app.use("/partials", express.static(__dirname + "/../public/partials"));
*/
app.use(express.static(__dirname + '/../public'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-PINGOTHER");//"X-Requested-With");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  res.header("Access-Control-Expose-Headers", "ETag");
//  res.header("Allow-Access-Control-Credentials", "true");
  next();
 });

require('./app/routes/generales.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
