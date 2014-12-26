var LocalStrategy    = require('passport-local').Strategy;

var constantes = require(global.PATH_API + "/config/constantes.js");

module.exports = function(app, passport, isLoggedIn) {
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    /*app.post('/login', passport.authenticate('local-login', {
	successRedirect: '/loginSuccess',
	failureRedirect: '/loginFailure',
	failureFlash : true // allow flash messages
    }));*/

    passport.use(new LocalStrategy({
        usernameField : 'login',
        passwordField : 'password'},
	function(login, password, done) {
	    console.log("login");
	    if (login === "admin" && password === "admin") // stupid example
		return done(null, {name: "admin"});
	    
	    return done(null, false, { message: 'Incorrect username.' });
	}
    ));

    app.post('/login', /*function(req, res) {*/passport.authenticate('local'), function(req, res) {
	console.log(req.body);
	res.send(req.user);
    });


    
/*    app.post('/loginNew', passport.authenticate('local'), function(req, res) {
	res.json(req.authInfo);
    });
*/

    app.get('/loginFailure', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	if (req.flash('loginMessage').length <= 0)
	    res.json({isAuthenticated: false, message: constantes.ERROR_REQUIREMENT_MISSING});
	else
	    res.json({isAuthenticated: false, message: req.flash('loginMessage')[0]});
	//next();
    });
 
    app.get('/loginSuccess', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.json({isAuthenticated: true, message: constantes.AUTHENTIFICATION_SUCCESS});
	//next();
    });
};
