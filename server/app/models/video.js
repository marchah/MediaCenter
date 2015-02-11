// load the things we need
var mongoose = require('mongoose');

// define the schema for our video model
var videoSchema = mongoose.Schema({
    title	: {type: String},
    description : {type: String},
    duration	: {type: String},
    path        : {type: String},
    pathType	: {
	    mp4  : {type: String}, 
	    webm : {type: String}
    },
    pathImage	: {type: String},
    type	: {type: String},
    tags        : [String],
    view	: {type: Number, default: 0},
    idUser	: {type : mongoose.Schema.Types.ObjectId},
    idChannel	: {type : mongoose.Schema.Types.ObjectId},
    uploadDate	: {type: Date, default: Date.now}
});

// create the model for videos and expose it to our app
module.exports = mongoose.model('Video', videoSchema);
