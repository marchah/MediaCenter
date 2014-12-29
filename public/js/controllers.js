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

mediacenterControllers.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Settings',
       function ($scope, $rootScope, $http, $location, Settings) {

	    $scope.isLoggin = function() {
		if (typeof $scope.user !== 'undefined')
		    return true;
		/*$http.get('/loggedin').success(function(user){
		    if (user !== '0') {
			$rootScope.user = user;
			return true;
		    }
		    else
			return false;
			});*/
		return false;
	    };
	    $scope.login = function() {

		$http.post(Settings.apiUri + 'login', {
		    login: $scope.user.username,
		    password: $scope.user.password,
		})
		    .success(function(user){
			    $rootScope.user = user;
			    $location.url('/news');
		    })
		.error(function(data, status, headers, config){
			$scope.errorMessage = "Authentication failed: " + data.message;
		    });
	    };
	}]);


mediacenterControllers.controller('LogoutCtrl', ['$scope', '$rootScope', '$http', '$location', 'Settings',
       function ($scope, $rootScope, $http, $location, Settings) {

	    $http.post(Settings.apiUri + 'logout')
		.success(function() {
			delete $rootScope.user;
			$location.url('/news');
		})
		.error(function(){
			$scope.errorMessage = "LogOut failed.";
		 });
	}]);


mediacenterControllers.controller('SignupCtrl', ['$scope', '$rootScope', '$http', '$location', 'Settings',
       function ($scope, $rootScope, $http, $location, Settings) {

	    $scope.signup = function() {
		$scope.errorMessage = "";
		if ($scope.user.login.indexOf(" ") > -1) {
		    $scope.errorMessage = "Login mustn't contain backspace.";
		    return false;
		}
		if ($scope.user.password != $scope.user.password2) {
		    $scope.errorMessage = "Passwords don't match.";
		    return false;
		}
		$http.post(Settings.apiUri + 'signup', {
		    name: $scope.user.name,
		    login: $scope.user.login,
		    email: $scope.user.email,
		    password: $scope.user.password,
		})
		.success(function(user){
			$rootScope.user = user;
			$location.url('/news');
		    })
		.error(function(data, status, headers, config){
			$scope.errorMessage = "Sign Up failed: " + data.message;
		    });
	    };
	}]);


mediacenterControllers.controller('ProfileCtrl', ['$scope', '$rootScope', '$http', '$location', 'Settings',
       function ($scope, $rootScope, $http, $location, Settings) {

	  if (typeof $scope.user === 'undefined')
	      $location.url('/news');
	  $scope.name = $scope.user["name"];
		/*$http.get('/loggedin').success(function(user){
		    if (user !== '0') {
			$rootScope.user = user;
			return true;
		    }
		    else
			return false;
			});*/

	    $scope.update = function() {
		$scope.errorMessage = "";
		if ($scope.user.password != $scope.user.password2) {
		    $scope.errorMessage = "New Passwords don't match.";
		    return false;
		}
		$http.post(Settings.apiUri + 'user', {
		    name: $scope.name,
		    password: $scope.user.password
		})
		.success(function(user){
			$rootScope.user = user;
		    })
		.error(function(data, status, headers, config){
			$scope.errorMessage = "Update failed: " + data.message;
		    });
	    };
	}]);


mediacenterControllers.controller('UploadCtrl', ['$scope', '$rootScope', '$http', '$location', 'Settings',
       function ($scope, $rootScope, $http, $location, Settings) {

	  if (typeof $scope.user === 'undefined')
	      $location.url('/news');
		/*$http.get('/loggedin').success(function(user){
		    if (user !== '0') {
			$rootScope.user = user;
			return true;
		    }
		    else
			return false;
			});*/

	    $scope.upload = function() {
		$scope.errorMessage = "";
		console.log($scope.title);
		console.log($scope.src);
		$http.post(Settings.apiUri + 'upload', {
			//title: $scope.video.title,
		    src: $scope.src
		})
		.success(function(){
			console.log("success");
		    })
		.error(function(data, status, headers, config){
			$scope.errorMessage = "Upload failed: " + data.message;
		    });
	    };
	}]);