var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var async = require('async');

var Channel    = require(global.PATH_API + '/app/models/channel');
var Video      = require(global.PATH_API + '/app/models/video');

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

    app.get('/channels/list', function(req, res) {
	async.waterfall([
	    function(callback){
		Channel.find({}, function(err, channels) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/channel.js: /channels/list Channel.find()", err);
			callback(err);
		    }
		    else {
			callback(null, channels);
		    }
		});
	    },
	    function(channels, callbackW) {
		var calls = [];
		var channelsWithVideos = [];

		channels.forEach(function(channel){
		    calls.push(function(callback) {
			Video.count({idChannel: channel._id}, function(err, count) {
			    if (err)
				callback(err);
			    else {
				channelJSON = channel.toJSON();
				channelJSON.count = count;
				if (count > 0)
				    channelsWithVideos.push(channelJSON);
				callback(null, channelJSON);
			    }
			});
		    })
		});

		async.parallel(calls, function(err, result) {
		    if (err)
			callbackW(err);
		    callbackW(null, channelsWithVideos);
		});
	    }
	], function (err, channels) {
	    if (err) {
		res.send({message: constantes.ERROR_API_DB, channels: false});
	    }
	    else {
		res.send({message: constantes.REQUEST_API_SUCCESS, channels: channels});
	    }
	});
    });
};
