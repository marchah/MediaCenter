var async = require('async');

var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

// load up the models
var User       = require(global.PATH_API + '/app/models/user');
var Video      = require(global.PATH_API + '/app/models/video');
var Channel    = require(global.PATH_API + '/app/models/channel');

var Search	= require(global.PATH_API + '/app/tools/search.js');

module.exports = function(app, passport, isLoggedIn) {

    app.get('/videos', function(req, res) {
	Search.searchVideo(null, 0, 0, res);
    });

    app.get('/videos/:numPage(\\d+)', function(req, res) {
	Search.searchVideo(null, req.params.numPage, 0, res);
    });

    app.get('/videos/:idChannel', function(req, res) {
	Search.searchVideo(req.params.idChannel, 0, 0, res);
    });

    app.get('/videos/:numPage(\\d+)/:nbVideoPerPage(\\d+)', function(req, res) {
	Search.searchVideo(null, req.params.numPage, req.params.nbVideoPerPage, res);
    });

    app.get('/videos/:idChannel/:numPage(\\d+)', function(req, res) {
	Search.searchVideo(req.params.idChannel, req.params.numPage, 0, res);
    });

    app.get('/videos/:idChannel/:numPage(\\d+)/:nbVideoPerPage(\\d+)', function(req, res) {
	Search.searchVideo(req.params.idChannel, req.params.numPage, req.params.nbVideoPerPage, res);
    });

    app.get('/video/:idVideo', function(req, res) {
	async.waterfall([
	    function(callback){
		Video.findOne({_id: req.params.idVideo}, {path: false, type: false, __v: false}, function(err, video) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /video/:idVideo Video.find", err);
			res.setHeader('Content-Type', 'application/json');
			res.json({message: constantes.ERROR_API_DB, video: false});
			callback(true);
			return ;
		    }
		    if (video == null) {
			res.setHeader('Content-Type', 'application/json');
			res.json({message: constantes.ERROR_UNKNOW_VIDEO, video: false});
			callback(true);
			return ;
		    }	
		    callback(null, video);
		});
	    },
	    function(video, callback){
		Channel.findOne({_id: video.idChannel}, function(err, channel) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /video Channel.find", err);
			res.setHeader('Content-Type', 'application/json');
			res.json({message: constantes.ERROR_API_DB, video: false});
			callback(true);
			return ;
		    }
		    if (channel == null) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /video Channel.find: channel not found ", err);
			res.setHeader('Content-Type', 'application/json');
			res.json({message: constantes.ERROR_UNKNOW_VIDEO, video: false});
			callback(true);
			return ;
		    }
		    var tmp = video.toObject();
		    tmp.channel = channel.name;
		    callback(null, tmp); 
		});
	    },
	    function(video, callback){
		User.findOne({_id: video.idUser}, function(err, user) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /video User.find", err);
			res.setHeader('Content-Type', 'application/json');
			res.json({message: constantes.ERROR_API_DB, video: false});
			callback(true);
			return ;
		    }
		    if (user == null) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /video User.find: user not found ", err);
			res.setHeader('Content-Type', 'application/json');
			res.json({message: constantes.ERROR_UNKNOW_VIDEO, video: false});
			callback(true);
			return ;
		    }
		    video.user = user.name;
		    delete video.idUser;
		    callback(null, video);
		});
	    }
	], function (err, video) {
	    if (!err) {
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.REQUEST_API_SUCCESS, video: video});
	    }
	    return ;
	});
    });

    app.get('/video/picture/:name', function(req, res) {
	res.sendfile(global.PATH_API + '/picture/' + req.params.name, function (err) {
	    if (err) {
		console.log("sendFile err: " + err);
		reporting.saveErrorAPI(constantes.TYPE_ERROR_STREAM, "app/routes/video.js: /video/picture/ sendFile ", err);
	    }
	});
    });

    app.get('/videoStream/:idVideo', function(req, res) {
	Video.findOne({_id: req.params.idVideo}, function(err, video) {
	    if (err) {
		console.log(err);
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /videoStream Video.findOne", err);
		res.send(500);
		return ;
	    }
	    if (video == null) {
		console.log("video not found");
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /videoStream Video.findOne: video not found", err);
		res.send(500);
		return ;
	    }
	    /*if (err) {
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, video: false});
		return ;
	    }
	    if (video == null) {
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_UNKNOW_VIDEO, video: false});
		return ;
	    }*/ // TODO: error gestion
	   
	    res.sendfile(global.PATH_API + '/' + video.path, function (err) {
		if (err)
		    reporting.saveErrorAPI(constantes.TYPE_ERROR_STREAM, "app/routes/video.js: /videoStream sendFile ", err);
	    });
	});
    });

    app.get('/news', function(req, res) {
	    console.log('test');
	Video.find({}, {title: true, description: true, duration: true}, {sort: {date: 'desc'}, limit: constantes.LIMIT_NB_NEWS}, function(err, videos) {
	    if (err) {
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /news Video.find()", err);
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, news: false});
		return ;
	    }

	    for (index in videos) {
		videos[index].pathImage = "picture/1.jpg";
		if (videos[index].description.length > constantes.SIZE_MAX_DESCRIPTION_LIST_VIDEO)
		    videos[index].description = videos[index].description.substr(0, constantes.SIZE_MAX_DESCRIPTION_LIST_VIDEO) + '...';
	    }

	    res.setHeader('Content-Type', 'application/json');
	    res.json({message: constantes.REQUEST_API_SUCCESS, news: videos});
	    return ;
	});
    });
};
