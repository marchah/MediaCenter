var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var Channel    = require(global.PATH_API + '/app/models/channel');

module.exports = function(app, passport, isLoggedIn) {

    app.get('/channels', function(req, res) {
	Channel.find({}, function(err, channels) {
	    if (err) {
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/channel.js: /channels Channel.find()", err);
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, channels: false});
		return ;
	    }
	    res.setHeader('Content-Type', 'application/json');
	    res.json({message: constantes.REQUEST_API_SUCCESS, channels: channels});
	    return ;
	});
    });
};
