// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var errorSchema = mongoose.Schema({
    type		: {type: String},
    message		: {type: String},
    stack		: {type: String},
    date		: {type: String},
    appVersionCode	: {type: Number},
    origin		: {type: Number, default: 1} //constantes.ERROR_ORIGIN_CLIENT}
});

// create the model for videos and expose it to our app
module.exports = mongoose.model('Error', errorSchema);
