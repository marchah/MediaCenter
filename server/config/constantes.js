function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("SIZE_MAX_DESCRIPTION_LIST_VIDEO", 150);


define("SIZE_MIN_NAME", 2);
define("SIZE_MAX_NAME", 30);

define("SIZE_MIN_LOGIN", 4);
define("SIZE_MAX_LOGIN", 20);

define("START_NUMBER_PAGE", 1);
define("MIN_NB_VIDEO_PER_PAGE", 1);
define("DEFAULT_NB_VIDEO_PER_PAGE", 10);
define("MAX_NB_VIDEO_PER_PAGE", 20);

define("LIMIT_NB_NEWS", 10);


define("PATH_FILE_ERROR_REPORTING", "reporting.log");
define("ERROR_API_DB", "Error: server internal error.");
define("ERROR_API", "Error: server internal error.");
define("ERROR_NOT_LOGGEDIN", "Error: you're not logged in.");
define("REQUEST_API_SUCCESS", "Request Success.");

// Error API Type
define("TYPE_ERROR_BDD", "1");
define("TYPE_ERROR_STREAM", "2");


// Error Origin
define("ERROR_ORIGIN_CLIENT", 1);
define("ERROR_ORIGIN_API", 2);


// Local Login

define("ERROR_REQUIREMENT_MISSING", "Login/Email or/and password missing.");
define("ERROR_UNKNOW_USER", "No user found.");
define("ERROR_WRONG_PASSWORD", "Oops! Wrong password.");
define("AUTHENTIFICATION_SUCCESS", "Connection success.");

// Video

define("ERROR_UNKNOW_VIDEO", "Unknow video.");
define("ERROR_UNKNOW_CHANNEL", "Unknow channel.");
//define("DEFAULT_VALUE_CHANNEL", "Unknow");


// Upload

define("PATH_FOLDER_TMP_VIDEO", "/tmp/");
define("PATH_FOLDER_VIDEO", "/video/");
define("VIDEO_MAX_SIZE", 100 * 1024 * 1024 );

define("SupportedTypes", ['video/mp4', 'video/webm', 'video/ogg']);
define("ERROR_TITLE_REQUIRE", "Title Required");
define("ERROR_ID_CHANNEL_REQUIRE", "IdChannel Required");
define("ERROR_ID_CHANNEL_INVALID", "Invalid idChannel");
define("ERROR_ID_USER_REQUIRE", "IdUser Required");
define("ERROR_UNSUPPORTED_TYPE", "Unsupported type: ");
define("ERROR_VIDEO_REQUIRE", "No Video Uploaded");
define("ERROR_VIDEO_SIZE_TOO_BIG", "Error: Video Limit Size: 100MB");
//define("ERROR_INVALID_VIDEO_EXTENSION", "Error Video's Extension Doesn't Accepted, Allow: .avi, .mp4 and .wmv");
//define("UPLOAD_SUCCESS", "Video Uploaded With Success");
//define("UPLOAD_FAILED", "Video Upload Failed");
