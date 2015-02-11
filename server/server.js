// server.js

// set up ======================================================================
var express  = require('express');
var app      = express();

var port     = process.env.PORT || 1948;
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

global.PATH_API	= __dirname;

require('./config/passport')(passport); // pass passport for configuration

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

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});

require('./app/routes/generales.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
