var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');
var mongoose = require('mongoose');

// load up the models
var Video      = require(global.PATH_API + '/app/models/video');
var Channel    = require(global.PATH_API + '/app/models/channel');

module.exports = {

    queryVideo: function(searchQuery, regex, numPage, nbVideoPerPage, cb) {
	if (regex != null)
	    Video.find(searchQuery, {title: true, description: true, duration: true, pathImage: true})
		.or([{ 'title': { $regex: regex }}, { 'description': { $regex: regex }}])
		.skip((numPage-1) * nbVideoPerPage)
		.limit(nbVideoPerPage)
		.exec(cb);
	else
	    Video.find(searchQuery, {title: true, description: true, duration: true, pathImage: true}, {skip: (numPage-1) * nbVideoPerPage, limit: nbVideoPerPage}, cb);
    },

    countVideo: function(searchQuery, regex, cb) {
	if (regex != null)
	    Video.count(searchQuery)
		.or([{ 'title': { $regex: regex }}, { 'description': { $regex: regex }}])
		.exec(cb);
	else
	    Video.count(searchQuery, cb);
    },

    searchVideo: function(idChannel, numPage, nbVideoPerPage, query, res) {
	var regex = null;
	if (typeof query.search !== 'undefined')
	    regex = new RegExp(query.search, 'i');
	var searchQuery = {};
	if (mongoose.Types.ObjectId.isValid(idChannel))
	    searchQuery.idChannel = idChannel;
	if (numPage < constantes.START_NUMBER_PAGE)
	    numPage = constantes.START_NUMBER_PAGE;
	if (nbVideoPerPage < constantes.MIN_NB_VIDEO_PER_PAGE
	    || nbVideoPerPage > constantes.MAX_NB_VIDEO_PER_PAGE)
	    nbVideoPerPage = constantes.DEFAULT_NB_VIDEO_PER_PAGE;
	var parent = this;
	this.queryVideo(searchQuery, regex, numPage, nbVideoPerPage, function(err, videos) {
	    if (err) {
		reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/tools/search.js: searchVideo Video.find", err);
		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.ERROR_API_DB, videos: false});
		return ;
	    }
	    
	    for (index in videos) {
		if (videos[index].description.length > constantes.SIZE_MAX_DESCRIPTION_LIST_VIDEO)
		    videos[index].description = videos[index].description.substr(0, constantes.SIZE_MAX_DESCRIPTION_LIST_VIDEO) + '...';
	    }

	    parent.countVideo(searchQuery, regex, function (err, count) {
		if (err) {
		    reporting.saveErrorAPI(constantes.TYPE_ERROR_BDD, "app/tools/search.js: searchVideo Video.count", err);
		    res.setHeader('Content-Type', 'application/json');
		    res.json({message: constantes.ERROR_API_DB, videos: false});
		    return ;
		}

		res.setHeader('Content-Type', 'application/json');
		res.json({message: constantes.REQUEST_API_SUCCESS, videos: videos, count: count});
		return ;
	    });
	});
    }
};
