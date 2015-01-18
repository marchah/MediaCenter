'use strict';

/* App Module */

var mediacenterApp = angular.module('mediacenterApp', [
    'ngRoute',
    'mediacenterControllers',
    'angularFileUpload'
]);

mediacenterApp.config(['$routeProvider',
	    function($routeProvider) {
		$routeProvider.
		    when('/videos', {
			templateUrl: 'partials/video-list.html',
			controller: 'VideoListCtrl'
		    }).
		    when('/videos/:page', {
			templateUrl: 'partials/video-list.html',
			controller: 'VideoListCtrl'
		    }).
		    when('/videos/:idChannel/:page', {
			templateUrl: 'partials/video-list.html',
			controller: 'VideoListCtrl'
		    }).
		    when('/video/:videoId', {
			templateUrl: 'partials/video-detail.html',
			controller: 'VideoDetailCtrl'
		    }).
		    when('/edit/:videoId', {
			templateUrl: 'partials/video-edit.html',
			controller: 'VideoEditCtrl'
		    }).
		    when('/channels', {
			templateUrl: 'partials/channel-list.html',
			controller: 'ChannelListCtrl'
		    }).
		    when('/users', {
			templateUrl: 'partials/user-list.html',
			controller: 'UserListCtrl'
		    }).
		    when('/user/:userId', {
			templateUrl: 'partials/public-profile.html',
			controller: 'PublicProfileCtrl'
		    }).
		    when('/news', {
			templateUrl: 'partials/news-list.html',
			controller: 'NewsListCtrl'
		    }).
		    when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl'
		    }).
		    when('/logout', {
			templateUrl: 'partials/logout.html',
			controller: 'LogoutCtrl'
		    }).
		    when('/signup', {
			templateUrl: 'partials/signup.html',
			controller: 'SignupCtrl'
		    }).
		    when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'ProfileCtrl'
		    }).
		    when('/upload', {
			templateUrl: 'partials/upload.html',
			controller: 'VideoCreateCtrl'
		    }).
		    otherwise({
			redirectTo: '/news'
		    });
	    }]);

//constants
mediacenterApp.constant('Settings', {
	apiUri: '/',
	Upload: {
	    MaxSize: 100 * 1024 * 1024,
	    TypeSupported: "video/mp4, video/webm, video/avi"
	},
	Message: {
	    AuthentificationRequired: "You must be authenticated",
	    NoVideoUploadSelected: "Please select a video to upload",
	    VideoSizeTooBig: "Error: Video Limit Size: 100MB"
	}
});

//directives

mediacenterApp.directive('focusMe', function($timeout, $parse) {
	return {
	    link: function(scope, element, attrs) {
		var model = $parse(attrs.focusMe);
		scope.$watch(model, function(value) {
			if(value === true) { 
			    $timeout(function() {
				    element[0].focus(); 
				});
			}
		    });
	    }
	};
    });