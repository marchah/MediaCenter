'use strict';

/* App Module */

var mediacenterApp = angular.module('mediacenterApp', [
    'ngRoute',
    'mediacenterControllers'
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
		    when('/channels', {
			templateUrl: 'partials/channel-list.html',
			controller: 'ChannelListCtrl'
		    }).
		    when('/users', {
			templateUrl: 'partials/user-list.html',
			controller: 'UserListCtrl'
		    }).
		    when('/news', {
			templateUrl: 'partials/news-list.html',
			controller: 'NewsListCtrl'
		    }).
		    when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl'
		    }).
		    otherwise({
			redirectTo: '/news'
		    });
	    }]);

//constants
mediacenterApp.constant('Settings', {
    apiUri: 'http://5.135.163.236:5050/'
});