var mongoose = require('mongoose');

var channelSchema = mongoose.Schema({
    name : {type: String}
});

module.exports = mongoose.model('Channel', channelSchema);
