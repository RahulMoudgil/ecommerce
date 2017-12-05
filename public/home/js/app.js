
var app = angular.module('fwrk.home', [
	'ui.router','btford.markdown','ngSanitize',
	// 'ngFileUpload',
		'fwrk.users'
])
.factory('Page', function() {//now this is not working 
   var title = 'default';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
})
.controller('TitleCtrl', function($scope, Page) {
    $scope.Page = Page;
})

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "/home/templates/index.html",
			controller: 'UserCtrl'
		})
		

		

	$urlRouterProvider.otherwise("/");
});