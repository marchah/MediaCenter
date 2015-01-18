// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var commentSchema = mongoose.Schema({
    text        : {type: String},
    idUser	: {type : mongoose.Schema.Types.ObjectId},
    idVideo	: {type : mongoose.Schema.Types.ObjectId},
    date	: {type: Date, default: Date.now}
});

// create the model for videos and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
