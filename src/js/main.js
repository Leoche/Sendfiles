jQuery(function(){
	console.log("d"),
	Dropzone.options.myAwesomeDropzone = {
		dictDefaultMessage:"Click or Drop files here to upload",
		createImageThumbnails: false,
		addedfile: function(file) { console.log(file); },
		init: function() {
			this.on("addedfile", function(file) { alert("Added file."); });
			this.on("uploadprogress",function(file,progress,bytesSent){
				console.log(progress)
			});
		}
	};
});

angular.module('dropzone', []).directive('dropzone', function () {
  return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
});

angular.module('sendfileApp', ['ngRoute','dropzone'])
.config(function($routeProvider) {
	$routeProvider
	    .when('/', {
	      templateUrl:'views/index.html',
          controller: 'sendfileController'
	    })
	    .when('/file', {
	      templateUrl:'views/file.html',
          controller: 'sendfileController'
	    })
	    .otherwise({
	      redirectTo:'/'
	    })
})
.controller('sendfileController', function($scope) {
	  $scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
		dictDefaultMessage:"Click or Drop files here to upload",
		createImageThumbnails: false,
		previewTemplate: null,
      'url': 'upload.php'
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
      },
      'success': function (file, response) {
      }
    }
  };
});