var async = require('async');
var mongoose = require('mongoose');
var _ = require("underscore");

var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');

var Comment    = require(global.PATH_API + '/app/models/comment');
var User    = require(global.PATH_API + '/app/models/user');

module.exports = function(app, passport, isLoggedIn) {

    app.get('/comments/:idVideo', function(req, res) {
	    Comment.find({idVideo: req.params.idVideo}, function(err, commentsBSON) {
		    if (err) {
			reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/comment.js: /comments/:idVideo Comment.find", err);
			res.status(500).send({message: constantes.ERROR_API_DB});
			return ;
		    }
		    if (commentsBSON == null) {
			res.status(500).send({message: constantes.ERROR_UNKNOW_VIDEO});
			return ;
		    }
		    var comments = [];
		    for (var i = 0; i != commentsBSON.length; i++) {
			comments.push(commentsBSON[i].toObject());
		    }
		    async.each(comments, function(comment, callback) {
			    User.findOne({_id: comment.idUser}, {name: true}, function(err, user) {
				    if (err)
					reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/comment.js: /comments/:idVideo User.findOne", err);
				    else if (user == null)
					reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/routes/comment.js: /comments/:idVideo user null", err);
				    else
					comment.user = user.name;
				    callback();
				});
			}, function(err){
			    res.send({message: constantes.REQUEST_API_SUCCESS, comments: comments});	
			});
		});
	});


    app.post('/comment', isLoggedIn, function(req, res) {
	    if (typeof req.body.text === 'undefined' || req.body.text.length <= 0)
		res.status(400).send({message: constantes.ERROR_NO_COMMENT_TEXT});
	    else if (typeof req.body.idVideo === 'undefined' || !mongoose.Types.ObjectId.isValid(req.body.idVideo))
		res.status(400).send({message: constantes.ERROR_UNKNOW_VIDEO});
	    else {
		var newComment = Comment();
		newComment.text = req.body.text;
		newComment.idVideo = req.body.idVideo;
		newComment.idUser = req.user._id;
		newComment.save(function(err) {
			if (err)
			    res.status(500).send({message: constantes.TYPE_ERROR_BDD});
			else {
			    var comment = newComment.toObject();
			    comment.user = req.user.name;
			    res.send({comment: comment});
			}
		    });
	    }
	});

	    /*
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
						    res.send({message: constantes.REQUEST_API_SUCCESS});
						});
				});
				});
			})
			});
	});

	    */
};
	    