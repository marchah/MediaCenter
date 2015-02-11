var LocalStrategy    = require('passport-local').Strategy;
var Validator        = require('validator');

var User	= require(global.PATH_API + '/app/models/user');
var constantes	= require(global.PATH_API + '/config/constantes.js');
var reporting	= require(global.PATH_API + '/app/tools/reporting.js');
var Tool	= require(global.PATH_API + '/app/models/Tools.class.js');

module.exports = function(app, passport, isLoggedIn) {

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/#/news',
                    failureRedirect : '/#/login'
            }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
	    passport.authenticate('facebook', {
		    successRedirect : '/#/videos',
			failureRedirect : '/#/login'
	    }));
    
    app.post('/login', function(req, res, next) {
	    passport.authenticate('local-login', function(err, user, info) {
		    if (err) { return next(err) }
		    if (!user) {
			return res.status(401).send(info);
		    }
		    req.logIn(user, function(err) {
			    if (err) { return next(err); }
			    return res.send(user);
			});
		})(req, res, next);
	});


    passport.use('local-signup', new LocalStrategy({
        usernameField : 'login',
	passwordField : 'password',
	passReqToCallback : true},
	function(req, login, password, done) {
	    if (!req.user) {
		if (!Validator.isLength(req.body.name, constantes.SIZE_MIN_NAME, constantes.SIZE_MAX_NAME))
		    return done(null, false, {message: 'Name size must be between '+constantes.SIZE_MIN_NAME+' and '+constantes.SIZE_MAX_NAME+'.'});
		if (!Validator.isLength(login, constantes.SIZE_MIN_LOGIN, constantes.SIZE_MAX_LOGIN))
		    return done(null, false, {message: 'Login size must be between '+constantes.SIZE_MIN_LOGIN+' and '+constantes.SIZE_MAX_LOGIN+'.'});
		if (Validator.contains(req.body.login, " "))
		    return done(null, false, {message: 'Login mustn\'t contain backspace.'});
		if (!Validator.isLength(password, constantes.SIZE_MIN_LOGIN, constantes.SIZE_MAX_LOGIN))
		    return done(null, false, {message: 'Password size must be between '+constantes.SIZE_MIN_LOGIN+' and '+constantes.SIZE_MAX_LOGIN+'.'});
		//if (!Tool.isValidePassword(password))
		//return done(null, false, {message: 'Password must contain at least one digit, one lower case, one upper case and 6 from the mentioned characters.'});
		if (!Validator.isEmail(req.body.email))
		    return done(null, false, {message: 'Email invalid format.'});
		User.findOne({ 'local.login' :  login }, function(err, user) {
			if (err)
			    return done(err);
			if (user)
			    return done(null, false, {message: 'That login is already taken.'});
			else {
			    User.findOne({ 'local.email' :  req.body.email.toLowerCase() }, function(err, user) {
				    if (err)
					return done(err);
				    if (user)
					return done(null, false, {message: 'That email is already taken.'});
				    else {
					// create the user
					var newUser            = new User();
					newUser.name           = req.body.name;
					newUser.local.login    = login;
					newUser.local.email    = req.body.email.toLowerCase();
					newUser.local.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if (err)
						    throw err;
						return done(null, newUser);
					    });
				    }
				});
			}
		    });
	    } else if ( !req.user.local.email ) {
		var user            = req.user;
		user.name     = req.body.name;
		user.local.login    = login;
		user.local.email    = req.body.email.toLowerCase();
		user.local.password = user.generateHash(password);
		
		user.save(function(err) {
			if (err)
			    throw err;
			return done(null, user);
		    });
	    } else {
		return done(null, req.user);
	    }
	}));

    app.post('/signup', function(req, res, next) {
	    passport.authenticate('local-signup', function(err, user, info) {
		    if (err) { return next(err) }
		    if (!user) {
			return res.status(400).send(info);
		    }
		    req.logIn(user, function(err) {
			    if (err) { return next(err); }
			    return res.send(user);
			});
		})(req, res, next);
	});


    app.get('/loggedin', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/logout', function(req, res) {
	req.logOut();
	res.send(200);
    });
};
