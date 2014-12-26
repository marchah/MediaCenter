// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var Validator        = require('validator');

// load up the user model
var User	= require(global.PATH_API + '/app/models/user');
var constantes	= require(global.PATH_API + '/config/constantes.js');
var reporting	= require(global.PATH_API + '/app/tools/reporting.js');
var Tool	= require(global.PATH_API + '/app/models/Tools.class.js');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


/*    passport.use('local', new LocalStrategy({
	usernameField : 'login',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route
    },
	    function(req, login, password, done) {
		process.nextTick(function() {
		    User.findOne({$or:[{'local.email': login.toLowerCase()}, {'local.login': login.toLowerCase()}]}, function(err, user) {
			if (err) {
			    reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "config/passport.js: local-login User.findOne ", err);
			    return done(err);
			}
			// if no user is found, return the message
			if (!user)
			    return done(null, false, {isAuthenticated: false, message: constantes.ERROR_UNKNOW_USER});
			if (!user.validPassword(password))
			    return done(null, false, {isAuthenticated: false, message: constantes.ERROR_WRONG_PASSWORD});
			// all is well, return user
			else
			    return done(null, user, {isAuthenticated: true, message: constantes.AUTHENTIFICATION_SUCCESS}); 
		    });
		});
	 }
	));
*/
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'login',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route
    },
      function(req, login, password, done) {
          process.nextTick(function() {
	      console.log('trying logging');
              User.findOne({$or:[{'local.email': login.toLowerCase()}, {'local.login': login.toLowerCase()}]}, function(err, user) {
                  if (err) {
		      reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "config/passport.js: local-login User.findOne ", err);
                      return done(err);
		  }
                  // if no user is found, return the message
                  if (!user)
		      return done(null, false, req.flash('loginMessage', constantes.ERROR_UNKNOW_USER));
                  if (!user.validPassword(password)) {
		      console.log('wrong password');
                      return done(null, false, req.flash('loginMessage', constantes.ERROR_WRONG_PASSWORD));
		  }
                  // all is well, return user
                  else
                      return done(null, user);
              });
	  });
    }));




};

