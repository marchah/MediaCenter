var constantes	= require(global.PATH_API + '/config/constantes.js');
var Error	= require(global.PATH_API + '/app/models/error');

var fs		= require('fs');

// Constructor
function Reporting() {}

// class methods
Reporting.prototype.saveErrorClient = function(error) {
    var newError = new Error();
    newError.type = error.type;
    newError.message = error.msg;
    newError.stack = error.stack;
    newError.date = error.date;
    newError.appVersionCode = error.apv;
    newError.origin = constantes.ERROR_ORIGIN_CLIENT;
    
    newError.save(function(err) {
	if (err) {
	    this.logErrorJSONTXT(error, constantes.ERROR_ORIGIN_CLIENT);
	    this.logErrorTXT(err);
	}
    });
};

Reporting.prototype.saveErrorAPI = function(type, msg, stack) {
    var newError = new Error();
    newError.type = type;
    newError.message = msg;
    newError.stack = stack;
    newError.date = new Date();
    newError.origin = constantes.ERROR_ORIGIN_API;
    
    newError.save(function(err) {
	if (err) {
	    this.logErrorJSONTXT(error, constantes.ERROR_ORIGIN_CLIENT);
	    this.logErrorTXT(err);
	}
    });
};

Reporting.prototype.logErrorTXT = function (error) {
    fs.appendFile(constantes.PATH_FILE_ERROR_REPORTING, error + "\n", function(err) {
	if(err)console.log(err);
    });
};

Reporting.prototype.logErrorJSONTXT = function (error, origin) {
    var err = error.type + " " + error.msg + " " + error.stack + " " + error.date + " " + error.apv + " " + origin
    this.logErrorTXT(err);
};

// export the class
module.exports = new Reporting();
