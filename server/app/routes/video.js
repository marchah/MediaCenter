var fs = require('fs-extra');
var ffmpeg = require('fluent-ffmpeg');

var async = require('async');
var mongoose = require('mongoose');
var _ = require("underscore");

var multipart = require('connect-multiparty');

var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var User       = require(global.PATH_API + '/app/models/user');
var Video      = require(global.PATH_API + '/app/models/video');
var Channel    = require(global.PATH_API + '/app/models/channel');

var Search	= require(global.PATH_API + '/app/tools/search.js');

var multipartMiddleware = multipart(/*{uploadDir: global.PATH_API + constantes.PATH_FOLDER_TMP_VIDEO }*/);

module.exports = function(app, passport, isLoggedIn) {

    app.get('/videos', function(req, res) {
	    Search.searchVideo(null, 0, 0, req.query, res);
    });

    app.get('/videos/:numPage(\\d+)', function(req, res) {
	    Search.searchVideo(null, req.params.numPage, 0, req.query, res);
    });

    app.get('/videos/:idChannel', function(req, res) {
	    Search.searchVideo(req.params.idChannel, 0, 0, req.query, res);
    });

    app.get('/videos/:numPage(\\d+)/:nbVideoPerPage(\\d+)', function(req, res) {
	    Search.searchVideo(null, req.params.numPage, req.params.nbVideoPerPage, req.query, res);
    });

    app.get('/videos/:idChannel/:numPage(\\d+)', function(req, res) {
	    Search.searchVideo(req.params.idChannel, req.params.numPage, 0, req.query, res);
    });

    app.get('/videos/:idChannel/:numPage(\\d+)/:nbVideoPerPage(\\d+)', function(req, res) {
	    Search.searchVideo(req.params.idChannel, req.params.numPage, req.params.nbVideoPerPage, req.query, res);
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

    app.put('/video/:idVideo', isLoggedIn, function(req, res) {
	    Video.findOne({_id: req.params.idVideo}, function(err, video) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: PUT /video/:idVideo Video.findOne", err);
			res.status(500).send({message: constantes.ERROR_API_DB});
			return ;
		    }
		    if (video == null) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: PUT /video/:idVideo Video.findOne", err);
			res.status(500).send({message: constantes.ERROR_UNKNOW_VIDEO, video: false});
			return ;
		    }
		    if (!req.user._id.equals(video.idUser)) {
			res.send(401);
			return ;
		    }
		    if (typeof req.body.title === 'undefined') {
			res.status(400).send({message: constantes.ERROR_TITLE_REQUIRE});
			return ;
		    }

		    if (typeof req.body.idChannel === 'undefined') {
			res.status(400).send({message: constantes.ERROR_ID_CHANNEL_REQUIRE});
			return ;
		    }

		    if (!mongoose.Types.ObjectId.isValid(req.body.idChannel)) {
			res.status(400).send({message: constantes.ERROR_ID_CHANNEL_INVALID});
			return ;
		    }

		    video.title = req.body.title;
		    if (typeof req.body.description === 'undefined')
			video.description = "";
		    else
			video.description = req.body.description;
		    if (typeof req.body.tags === 'undefined')
			video.tags = [];
		    else if (req.body.tags.constructor === Array) {
			video.tags = req.body.tags;
		    }
		    else {
			res.status(400).send({message: constantes.ERROR_INVALID_TAGS});
			return ;
		    }

		    video.idChannel = req.body.idChannel;
		    video.save(function(err) {
			    if (err) {
				reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: PUT /video/:idVideo Video.save", err);
				res.status(500).send({message: constantes.ERROR_API_DB});
				return ;
			    }
			    res.send({message: constantes.REQUEST_API_SUCCESS});
			});
		}); 
	});

    app.delete('/video/:idVideo', isLoggedIn, function(req, res) {
	    Video.findOne({_id: req.params.idVideo}, function(err, video) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: PUT /video/:idVideo Video.findOne", err);
			res.status(500).send({message: constantes.ERROR_API_DB});
			return ;
		    }
		    if (video == null) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: PUT /video/:idVideo Video.findOne", err);
			res.status(500).send({message: constantes.ERROR_UNKNOW_VIDEO, video: false});
			return ;
		    }
		    if (!req.user._id.equals(video.idUser)) {
			res.send(401);
			return ;
		    }   
		    var videoURI = constantes.PATH_FOLDER_VIDEO + video._id;
		    fs.unlink(global.PATH_API + video.path, function (err) {
			    if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: DELETE /video/:idVideo unlink video.path", err); 
			});
		    fs.unlink(global.PATH_API + videoURI + ".mp4", function (err) {
			    if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: DELETE /video/:idVideo unlink .mp4", err); 
			});
		    fs.unlink(global.PATH_API + videoURI + ".webm", function (err) {
			    if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: DELETE /video/:idVideo unlink .webm", err); 
			});
		    fs.unlink(global.PATH_API + constantes.PATH_FOLDER_IMAGE + video._id + ".png", function (err) {
			    if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: DELETE /video/:idVideo unlink .png", err); 
			});
		    video.remove();
		    res.send({message: constantes.REQUEST_API_SUCCESS});
		}); 
	});

    app.get('/video/picture/:name', function(req, res) {
       res.sendfile(global.PATH_API + '/picture/' + req.params.name + ".png", function (err) {
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
	    video.view += 1;
	    video.save(function(err) {if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /videoStream Video.save: add view", err);});
	    res.sendfile(global.PATH_API + '/' + video.path, function (err) {
		if (err)
		    reporting.saveErrorAPI(constantes.TYPE_ERROR_STREAM, "app/routes/video.js: /videoStream sendFile ", err);
	    });
	});
    });

    app.get('/videoStream/:type/:idVideo', function(req, res) {
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
	    video.view += 1;
	    video.save(function(err) {if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/video.js: /videoStream Video.save: add view", err);});
	    res.sendfile(global.PATH_API + '/' + video.pathType[req.params.type], function (err) {
		if (err)
		    reporting.saveErrorAPI(constantes.TYPE_ERROR_STREAM, "app/routes/video.js: /videoStream sendFile ", err);
	    });
	});
    });

    app.post('/relatedVideo/:idVideo', function(req, res) {
	    if (typeof req.body.tags === 'undefined') {
		res.send({videos: []});
		return ;
	    }
	    var query = {_id: {'$ne': req.params.idVideo}, $or:[]};
	    for (var i = 0; i != req.body.tags.length; i++) {
		var regex = new RegExp(req.body.tags[i], 'i');
		query.$or.push({'tags' : regex});
	    }
	    Video.find(query).limit(constantes.LIMIT_NB_RELATED_VIDEO).exec(function(err, videos) {
		    res.send({videos: videos});
		});
	});

    app.get('/news', function(req, res) {
	    Video.find({}, {title: true, description: true, duration: true, pathImage: true}, {sort: {date: 'desc'}, limit: constantes.LIMIT_NB_NEWS}, function(err, videos) {
	    if (err) {
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /news Video.find()", err);
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, news: false});
		return ;
	    }

	    for (index in videos) {
		if (videos[index].description.length > constantes.SIZE_MAX_DESCRIPTION_LIST_VIDEO)
		    videos[index].description = videos[index].description.substr(0, constantes.SIZE_MAX_DESCRIPTION_LIST_VIDEO) + '...';
	    }

	    res.setHeader('Content-Type', 'application/json');
	    res.json({message: constantes.REQUEST_API_SUCCESS, news: videos});
	    return ;
	});
    });

    app.post('/video', isLoggedIn, function(req, res) {

	    if (typeof req.body.title === 'undefined') {
		res.status(400).send({message: constantes.ERROR_TITLE_REQUIRE});
		return ;
	    }

	    if (typeof req.body.path === 'undefined') {
		res.status(400).send({message: constantes.ERROR_VIDEO_REQUIRE});
		return ;
	    }

	    if (typeof req.body.idChannel === 'undefined') {
		res.status(400).send({message: constantes.ERROR_ID_CHANNEL_REQUIRE});
		return ;
	    }
	    if (!mongoose.Types.ObjectId.isValid(req.body.idChannel)) {
		res.status(400).send({message: constantes.ERROR_ID_CHANNEL_INVALID});
		return ;
	    }

	    var newVideo = new Video();

	    var videoURI = constantes.PATH_FOLDER_VIDEO + newVideo._id;

	    newVideo.title = req.body.title;
	    if (typeof req.body.description === 'undefined')
		newVideo.description = "";
	    else
		newVideo.description = req.body.description;

	    if (typeof req.body.tags === 'undefined')
		newVideo.tags = [];
	    else if (req.body.tags.constructor === Array) {
		newVideo.tags = req.body.tags;
	    }
	    else {
		res.status(400).send({message: constantes.ERROR_INVALID_TAGS});
		return ;
	    }
	    newVideo.path = videoURI + '.' + req.body.path.split('.').pop();
	    newVideo.pathType.mp4 = videoURI + ".mp4";
	    newVideo.pathType.webm = videoURI + ".webm";
	    newVideo.idUser = req.user._id;
	    newVideo.idChannel = req.body.idChannel;

	    fs.ensureDir(global.PATH_API + constantes.PATH_FOLDER_VIDEO, function(err) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /upload fs.ensureDir()", err);
			res.status(500).send({message: constantes.ERROR_API});
			return ;
		    }
		    fs.copy(req.body.path, global.PATH_API + newVideo.path, function(err) {
			    if (err) {
				reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /upload fs.move()", err);
				res.status(500).send({message: constantes.ERROR_API});
				return ;
			    }
			    
			    if (req.body.path.split('.').pop() !== 'mp4')
				ffmpeg(req.body.path).format('mp4')
				    .on('error', function(err) {
					    console.log('Cannot process video: ' + err.message);
					})
				    .on('end', function() {
					    console.log('Processing finished successfully');
					})
				    .saveToFile(global.PATH_API + videoURI + '.mp4');

			    if (req.body.path.split('.').pop() !== 'webm')
				ffmpeg(req.body.path).format('webm')
				    .on('error', function(err) {
					    console.log('Cannot process video: ' + err.message);
					})
				    .on('end', function() {
					    console.log('Processing finished successfully');
					})
				    .saveToFile(global.PATH_API + videoURI + '.webm');

			    fs.ensureDir(global.PATH_API + constantes.PATH_FOLDER_IMAGE, function(err) {
				    if (err) {
					reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /upload fs.ensureDir(PATH_FOLDER_IMAGE)", err);
				    }
				    else {
					newVideo.pathImage = constantes.PATH_FOLDER_IMAGE + newVideo._id + ".png";

					ffmpeg(global.PATH_API + newVideo.path)
					    .screenshots({
						    timestamps: ['5%'],
							filename: newVideo._id + '.png',
							folder: global.PATH_API + constantes.PATH_FOLDER_IMAGE,
							size: '320x240'
					    });
				    }

				    ffmpeg.ffprobe(global.PATH_API + newVideo.path, function(err, metadata) {
					    if (!err)
						newVideo.duration = Math.ceil(metadata.format.duration);				    
					    newVideo.save(function(err) {
						    if (err) {
							reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /upload Video.save()", err);
							res.status(500).send({message: constantes.ERROR_API_DB});
							return ;
						    }
						    res.send({message: constantes.REQUEST_API_SUCCESS, idVideo: newVideo._id});
						});
				});
				});
			})
			});
	});

    app.post('/uploadVideo', multipartMiddleware, function(req, res) {
	    var file = req.files.file;
	    if (file.size > constantes.VIDEO_MAX_SIZE) {
		res.status(400).send(constantes.ERROR_VIDEO_SIZE_TOO_BIG);
		fs.unlink(file.path, function (err) {
			if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /uploadVideo fs.unlink()", err);
		    });
	    }
	    else if (!_.contains(constantes.SupportedTypes, file.type)) {
		res.status(400).send(constantes.ERROR_UNSUPPORTED_TYPE + file.type);
		fs.unlink(file.path, function (err) {
			if (err) reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/route/video.js: /uploadVideo fs.unlink()", err);
		    });
	    }
	    else
		res.send({path: file.path});
	});

};
