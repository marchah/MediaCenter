// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

    passport.use(new FacebookStrategy({
		clientID        : configAuth.facebookAuth.clientID,
		clientSecret    : configAuth.facebookAuth.clientSecret,
		callbackURL     : configAuth.facebookAuth.callbackURL
	    },
    function(token, refreshToken, profile, done) {
	process.nextTick(function() {
		User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
			console.log('etst');
			if (err)
			    return done(err);
			if (user) {
			    console.log('exist');
			    return done(null, user);
			} else {
			    console.log('new');
			    var newUser            = new User();
			    newUser.name           = profile.name.givenName + ' ' + profile.name.familyName;
			    newUser.facebook.id    = profile.id;
			    newUser.facebook.token = token;
			    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
			    newUser.facebook.email = profile.emails[0].value;
			    newUser.save(function(err) {
				    if (err)
					throw err;
				    return done(null, newUser);
				});
			}
		    });
	    });
    }));

};

