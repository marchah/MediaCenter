var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var Channel    = require(global.PATH_API + '/app/models/channel');

module.exports = function(app, passport) {

// normal routes ===============================================================

    app.get('*', function(req, res) {
	res.sendfile('public/index.html');
    });


    app.post('/reportError', function(req, res) {

	var obj = JSON.parse(req.body.listError);
	obj.forEach(function(item, index) {
	    reporting.saveErrorClient(item);
	});
	res.setHeader('Content-Type', 'application/json');
	res.json({success: true});
    });


    app.get('/listChannel', function(req, res) {
	Channel.find({}, function(err, listChannel) {
	    if (err) {
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/generql.js: /listChannel Channel.find", err);
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, listChannel: false});
		return ;
	    }

	    res.setHeader('Content-Type', 'application/json');
	    res.json({message: constantes.REQUEST_API_SUCCESS, listChannel: listChannel});
//	    res.send();
	    return ;
	});
    });

    require(global.PATH_API + '/app/routes/video.js')(app, passport, isLoggedIn);
    require(global.PATH_API + '/app/routes/channel.js')(app, passport, isLoggedIn);
    require(global.PATH_API + '/app/routes/user.js')(app, passport, isLoggedIn);
    require(global.PATH_API + '/app/routes/authenticate.js')(app, passport, isLoggedIn);

};

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
	res.send(401);
	next();
    }
    else {
	next();
    }
}
