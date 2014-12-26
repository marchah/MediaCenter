var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var User       = require(global.PATH_API + '/app/models/user');

module.exports = function(app, passport, isLoggedIn) {

    app.get('/users', isLoggedIn, function(req, res) {
	User.find({}, {name: true}, function(err, users) {
	    if (err) {
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/user.js: /users User.find()", err);
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, users: false});
		return ;
	    }
	    res.setHeader('Content-Type', 'application/json');
	    res.json({message: constantes.REQUEST_API_SUCCESS, users: users});
	    return ;
	});
    });
};
