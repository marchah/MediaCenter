// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name: {type: String},
    local            : {
	login	     : {type: String, match: /^[a-zA-Z0-9-_]+$/},
	email	     : {type: String, match: /\S+@\S+\.\S+/},
	password     : {type: String},
	hashConformationEmail: {type: String},
	birthday     : {type: Date},
	actif        : {type: Boolean},
	admin        : {type: Boolean}
    },
    inscriptionDate: {type: Date, default: Date.now}
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
