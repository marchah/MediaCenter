var Validator        = require('validator');

var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var User       = require(global.PATH_API + '/app/models/user');

module.exports = function(app, passport, isLoggedIn) {

    app.get('/users', function(req, res) {
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

    app.post('/user', isLoggedIn, function(req, res) {
	    if (!Validator.isLength(req.body.name, constantes.SIZE_MIN_NAME, constantes.SIZE_MAX_NAME))
		return res.status(400).send({message: 'Name size must be between '+constantes.SIZE_MIN_NAME+' and '+constantes.SIZE_MAX_NAME+'.'});
	    if (!Validator.isLength(req.body.password, constantes.SIZE_MIN_LOGIN, constantes.SIZE_MAX_LOGIN))
		return res.status(400).send({message: 'Password size must be between '+constantes.SIZE_MIN_LOGIN+' and '+constantes.SIZE_MAX_LOGIN+'.'});
	    //if (!Tool.isValidePassword(password))
	    //return done(null, false, {message: 'Password must contain at least one digit, one lower case, one upper case and 6 from the mentioned characters.'});

	    User.findOne({_id: req.user._id}, function(err, user) {
		    if (err)
			throw err;
		    if (!user)
			return res.status(500).send({message: 'Unknow User.'});
		    user.name = req.body.name;
		    user.local.password = user.generateHash(req.body.password);
		    user.save(function(err) {
			    if (err)
				throw err;
			    return res.send(user);
			});
		});
	});
};
