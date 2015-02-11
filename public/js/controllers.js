'use strict';

/* Controllers */

var mediacenterControllers = angular.module('mediacenterControllers', []);

mediacenterControllers.controller('VideoListCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$location', 'Settings',
	 function ($scope, $rootScope, $routeParams, $http, $location, Settings) {
	    $scope.filter = function() {
		$rootScope.query = $scope.query;
		$location.url('/videos/' + (typeof $routeParams.idChannel != 'undefined' ? $routeParams.idChannel + '/' : '') + '1');
		$scope.query = $rootScope.query;
		$scope.search(1);
	    };
	    $scope.search = function(currentPage) {
		var page = currentPage;
		if (isNaN(page) || page < 1)
		    page = 1;
		var idChannel = "";
		if (typeof $routeParams.idChannel != 'undefined')
		    var idChannel = $routeParams.idChannel + "/";
		$http.get(Settings.apiUri + 'videos/' + idChannel + page, {params: {search: $scope.query}}).success(function(data) {
		    $scope.videos = data.videos;
		    if (typeof data.videos != 'undefined' && data.count != 0 && data.videos.length != 0)
			$scope.nbPages = Math.ceil(data.count / data.videos.length);
		    else
			$scope.nbPages = 0;
		    $scope.videoImageUri = Settings.apiUri + "video/picture/";
		    $scope.idChannel = idChannel;
		    $scope.getNumber = function(num) {
			return new Array(num);
		    }
		});
	    };
	    $scope.search(parseInt($routeParams.page));
	}]);

mediacenterControllers.controller('VideoDetailCtrl', ['$scope', '$sce', '$routeParams', '$http', 'Settings', '$window',
      function($scope, $sce, $routeParams, $http, Settings, $window) {

  	  var videoType = function($window) {
	      var userAgent = $window.navigator.userAgent;
	      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
	      var videoTypeSupported = {chrome: 'webm/', safari: 'mp4/', firefox: 'webm/', ie: 'mp4/'};
	      for(var key in browsers) {
		  if (browsers[key].test(userAgent)) {
		      return videoTypeSupported[key];
		  }
	      };
	      return '';
	  }
	  $scope.isLoggin = function() {
	      return (typeof $scope.user !== 'undefined');
	  }

	  $http.get(Settings.apiUri + 'video/' + $routeParams.videoId).success(function(data) {
	      $scope.video = data.video;
	      $scope.video.duration = Math.trunc($scope.video.duration / 60) + ':' + $scope.video.duration % 60;
	      $scope.videoURL = $sce.trustAsResourceUrl(Settings.apiUri + "videoStream/" + videoType($window) + data.video._id);
	      if (!data.video)
		  alert(data.message);
	      $scope.videoImageUri = Settings.apiUri + "video/picture/";
	      $http.post(Settings.apiUri + 'relatedVideo/' + data.video._id, {tags: data.video.tags}).success(function(data) {
		      $scope.video.related = data.videos;
		  });
	  });
	  $http.get(Settings.apiUri + 'comments/' + $routeParams.videoId)
	      .success(function(data) {
		      $scope.comments = data.comments;
		  })
	      .error(function(data){
		      if (typeof data.message !== 'undefined')
			  $scope.errorComments = data.message;
		      else
			  $scope.errorComments = data;
		  });

	    $scope.submitComment = function() {
		$scope.errorMessage = "";
		if (typeof $scope.user === 'undefined') {
		    $scope.errorMessage = Settings.Message.AuthentificationRequired;
		    return;
		}
		$scope.idVideo = $routeParams.videoId;
		$http.post(Settings.apiUri + 'comment', {text: $scope.comment, idVideo: $scope.idVideo})
		.success(function(data){
			$scope.comments.push(data.comment);
			$scope.comment = "";
		    })
		.error(function(data){
			if (typeof data.message !== 'undefined')
			    $scope.errorMessage = data.message;
			else
			    $scope.errorMessage = data;
		    });
	    };

      }]);


mediacenterControllers.controller('VideoEditCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$location', '$window', 'Settings',
    function ($scope, $rootScope, $routeParams, $http, $location, $window, Settings) {

	  if (typeof $scope.user === 'undefined')
	      $location.url('/news');
	  else {
	      $scope.name = $scope.user["name"];

	  $http.get(Settings.apiUri + 'video/' + $routeParams.videoId).success(function(data) {
		  if ($scope.user._id !== data.video.idUser)
		      $location.url('/news');
		  $scope.video = data.video;
		  $scope.videoImageUri = Settings.apiUri + "video/picture/";
		  $scope.video.tagsString = '';
		  for (var i = 0; i != data.video.tags.length; i++) {
		      if (i > 0)
			  $scope.video.tagsString += Settings.Upload.TagDelimiter;
		      $scope.video.tagsString += data.video.tags[i];
		  }
		  if (!data.video)
		      alert(data.message);
	  });

	  $http.get(Settings.apiUri + 'channels').success(function(data) {
	      $scope.channels = data.channels;
//		  $scope.video = {idChannel: data.channels[0]._id};
	  });

	  $scope.delete = function() {
	      $scope.message = "";

	      var deleteVideo = $window.confirm('Are you sure to delete this video?');
	      if (deleteVideo) {
		  $http.delete(Settings.apiUri + 'video/' + $scope.video._id)
		      .success(function(data){
			      $location.url('/profile');
			  })
		      .error(function(data){
			      if (typeof data.message !== 'undefined')
				  $scope.message = data.message;
			      else
				  $scope.message = data;
			  });
	      }
	  };

	  $scope.update = function() {
	      $scope.message = "";

	      $http.put(Settings.apiUri + 'video/' + $scope.video._id, {
		  title: $scope.video.title,
		  description: $scope.video.description,
		  idChannel: $scope.video.idChannel,
		  tags: $scope.video.tagsString.split(Settings.Upload.TagDelimiter)
		})
		.success(function(data){
			$scope.message = data.message;
		    })
		.error(function(data, status, headers, config){
			if (typeof data.message !== 'undefined')
			    $scope.message = data.message;
			else
			    $scope.message = data;
		    });
	    };
	  }
	}]);


mediacenterControllers.controller('ChannelListCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $http.get(Settings.apiUri + 'channels/list').success(function(data) {
		$scope.channels = data.channels;
	    });
	}]);

mediacenterControllers.controller('UserListCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $http.get(Settings.apiUri + 'users').success(function(data) {
		$scope.users = data.users;
	    });
	}]);

mediacenterControllers.controller('SessionCtrl', ['$scope', '$rootScope', '$http', 'Settings',
	function ($scope, $rootScope, $http, Settings) {
	    if (typeof $rootScope.user === 'undefined' || $rootScope.user == false)
		$http.get('/loggedin').success(function(user){
			if (typeof user !== 'undefined' && user != '0')
			    $rootScope.user = user;
			else
			    $rootScope.user = undefined;
		    });
	}]);

mediacenterControllers.controller('NewsListCtrl', ['$scope', '$http', 'Settings',
	function ($scope, $http, Settings) {
	    $http.get(Settings.apiUri + 'news')
		.success(function(data) {
		    $scope.news = data.news;
		    $scope.videoImageUri = Settings.apiUri + "video/picture/";
		})
		.error(function(data, status, headers, config){
		    alert(data.message);
		});
	}]);

mediacenterControllers.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Settings',
       function ($scope, $rootScope, $http, $location, Settings) {

	    $scope.isLoggin = function() {
		if (typeof $scope.user !== 'undefined')
		    return true;
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

	   $scope.isLocalLogin = function() {
	       if (typeof $scope.user.local !== 'undefined')
		   return true;
	       return false;
	   };

	  $http.get(Settings.apiUri + 'user/' + $scope.user._id).success(function(data) {
		  $scope.user = data.user;
		  $scope.videos = data.videos;
		  if (typeof data.videos !== 'undefined' && data.videos != false)
		      $scope.countVideos = data.videos.length;
		  else
		      $scope.countVideos = 0;
		  $scope.videoImageUri = Settings.apiUri + "video/picture/";
	  });

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


mediacenterControllers.controller('PublicProfileCtrl', ['$scope', '$http', '$routeParams', 'Settings',
	function ($scope, $http, $routeParams, Settings) {

	  $http.get(Settings.apiUri + 'user/' + $routeParams.userId).success(function(data) {
		  $scope.user = data.user;
		  $scope.videos = data.videos;
		  if (typeof data.videos !== 'undefined' && data.videos != false)
		      $scope.countVideos = data.videos.length;
		  else
		      $scope.countVideos = 0;
		  $scope.videoImageUri = Settings.apiUri + "video/picture/";
	  });

	}]);


mediacenterControllers.controller('VideoCreateCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$upload', 'Settings',
       function ($scope, $rootScope, $timeout, $http, $location, $upload, Settings) {

	     if (typeof $scope.user === 'undefined')
		 $location.url('/news');

	  $scope.VideoTypeSupported = Settings.Upload.TypeSupported;

	  $http.get(Settings.apiUri + 'channels').success(function(data) {
		  $scope.channels = data.channels;
		  $scope.video = {idChannel: data.channels[0]._id};
	      });

	  $scope.onFileSelect = function($file) {
	      console.log('test onfileselect');
	      $scope.uploadVideo($file.video.src);
	  },
	  $scope.uploadVideo = function($files) {
	      console.log('test');
	      $scope.processing = "";
	      if ($files[0].size > Settings.Upload.MaxSize) {
		  $scope.errorMessage = Settings.Message.VideoSizeTooBig;
		  $scope.video.src = null;
		  return ;
	      }
	      if (typeof $scope.video === "undefined")
		  $scope.video = {title: $files[0].name.substr(0, $files[0].name.lastIndexOf('.'))};
	      else if (typeof $scope.video.title === "undefined" || $scope.video.title.length <= 0)
		  $scope.video.title = $files[0].name.substr(0, $files[0].name.lastIndexOf('.'));
	      $upload.upload({
		      url: Settings.apiUri + 'uploadVideo',
			  file: $files[0]
	      }).progress(function(evt) {
		      $scope.processing = 'progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
	      }).success(function(data, status, headers, config) {
		      $scope.processing = "Uploaded successfully"
		      $scope.path = data.path;
	      }).error(function(data) {
		      $scope.errorMessage = data;
	      });

	  },


	    $scope.upload = function() {
		$scope.errorMessage = "";

		if (typeof $scope.path === "undefined" || $scope.path.length <= 0) {
		    $scope.errorMessage = Settings.Message.NoVideoUploadSelected;
		    return ;
		}

		var tags = [];
		if (typeof $scope.video.tags !== 'undefined')
		    tags = $scope.video.tags.split(Settings.Upload.TagDelimiter);
		$http.post(Settings.apiUri + 'video', {
		    title: $scope.video.title,
		    description: $scope.video.description,
		    idChannel: $scope.video.idChannel,
		    tags: tags,
		    path: $scope.path
		})
		.success(function(data){
		    $scope.errorMessage = data.message + " You will be redirect to the video in 5s.";
		    $timeout(function() {
			$location.url('/edit/' + data.idVideo);
		    }, 5000);
		})
		.error(function(data, status, headers, config){
			if (typeof data.message !== 'undefined')
			    $scope.errorMessage = "Upload failed: " + data.message;
			else
			    $scope.errorMessage = "Upload failed: " + data;
		    });
	    };
	}]);
