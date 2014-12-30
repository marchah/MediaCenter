var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var Channel    = require(global.PATH_API + '/app/models/channel');

module.exports = function(app, passport) {

// normal routes ===============================================================

    require(global.PATH_API + '/app/routes/video.js')(app, passport, isLoggedIn);
    require(global.PATH_API + '/app/routes/channel.js')(app, passport, isLoggedIn);
    require(global.PATH_API + '/app/routes/user.js')(app, passport, isLoggedIn);
    require(global.PATH_API + '/app/routes/authenticate.js')(app, passport, isLoggedIn);

    app.get('*', function(req, res) {
	res.sendfile('public/index.html');
    });
};

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
	res.send(401);
	return ;
    }
    else {
	next();
    }
}
