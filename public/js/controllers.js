'use strict';

/* Controllers */

var mediacenterControllers = angular.module('mediacenterControllers', []);

mediacenterControllers.controller('VideoListCtrl', ['$scope', '$routeParams', '$http', 'Settings',
	function ($scope, $routeParams, $http, Settings) {
	    var page = parseInt($routeParams.page);
	    if (isNaN(page) || page < 1)
		page = 1;
	    var idChannel = "";
	    if (typeof $routeParams.idChannel != 'undefined')
		var idChannel = $routeParams.idChannel + "/";
	    $http.get(Settings.apiUri + 'videos/' + idChannel + page).success(function(data) {
		$scope.videos = data.videos;
		if (typeof data.videos != 'undefined' && data.count != 0 && data.videos.length != 0)
		    $scope.nbPages = Math.ceil(data.count / data.videos.length);
		else
		    $scope.nbPages = 0;
		$scope.videoImageUri = Settings.apiUri + "video/";
		$scope.idChannel = idChannel;
		$scope.getNumber = function(num) {
		    return new Array(num);
		}
	    });
	}]);

mediacenterControllers.controller('VideoDetailCtrl', ['$scope', '$sce', '$routeParams', '$http', 'Settings',
      function($scope, $sce, $routeParams, $http, Settings) {
	  $http.get(Settings.apiUri + 'video/' + $routeParams.videoId).success(function(data) {
	      $scope.video = data.video;
	      $scope.videoURL = $sce.trustAsResourceUrl(Settings.apiUri + "videoStream/" + data.video._id);
	      console.log($scope.videoURL);
	      if (!data.video)
		  alert(data.message);
	  });
      }]);


mediacenterControllers.controller('ChannelListCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $http.get(Settings.apiUri + 'channels').success(function(data) {
		$scope.channels = data.channels;
	    });
	}]);

mediacenterControllers.controller('UserListCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $http.get(Settings.apiUri + 'users').success(function(data) {
		$scope.users = data.users;
	    });
	}]);

mediacenterControllers.controller('NewsListCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $http.get(Settings.apiUri + 'news').success(function(data) {
		$scope.news = data.news;
		$scope.videoImageUri = Settings.apiUri + "video/";
	    });
	}]);

mediacenterControllers.controller('LoginCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $scope.login = function() {

		$http.post(Settings.apiUri + 'login', {
		    login: $scope.user.username,
		    password: $scope.user.password,
		})
		    .success(function(user){
      // No error: authentication OK
		//	$rootScope.message = 'Authentication successful!';
		//	$location.url('/admin');
			console.log('success');
		    })
		    .error(function(){
      // Error: authentication failed
			//$rootScope.message = 'Authentication failed.';
			//$location.url('/login');
			console.log('failed');
		    });
	    };
	}]);