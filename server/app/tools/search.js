var constantes = require(global.PATH_API + '/config/constantes.js');
var reporting = require(global.PATH_API + '/app/tools/reporting.js');
var mongoose = require('mongoose');

// load up the models
var Video      = require(global.PATH_API + '/app/models/video');
var Channel    = require(global.PATH_API + '/app/models/channel');

module.exports = {

    searchVideo: function(idChannel, numPage, nbVideoPerPage, res) {
	var searchQuery = {};
	if (mongoose.Types.ObjectId.isValid(idChannel))
	    searchQuery.idChannel = idChannel;
	if (numPage < constantes.START_NUMBER_PAGE)
	    numPage = constantes.START_NUMBER_PAGE;
	/*if (nbVideoPerPage < constantes.MIN_NB_VIDEO_PER_PAGE
	    || nbVideoPerPage > constantes.MAX_NB_VIDEO_PER_PAGE)
	    nbVideoPerPage = constantes.DEFAULT_NB_VIDEO_PER_PAGE;*/
nbVideoPerPage = 1;

	Video.find(searchQuery, {title: true, description: true, duration: true, pathImage: true}, {skip: (numPage-1) * nbVideoPerPage, limit: nbVideoPerPage}, function(err, videos) {
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

	    Video.count(searchQuery, function(err, count) {
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
