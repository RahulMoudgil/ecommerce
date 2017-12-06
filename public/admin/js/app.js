
var adminApp = angular.module('fwrk.admin', [
	'ui.router',
	'btford.markdown',
	'angular-page-loader',
	'fwrk.users'

]);

adminApp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');
	
	$stateProvider
	.state('dashboard', {
		url: '/',
		templateUrl: '/admin/templates/admin_index.html',
		controller: 'dashboardCtrl'
	})
		.state('userList', {
			url: '/userList',
			templateUrl: '/admin/templates/userList.html',
			resolve: {
				userList: function(Users){
					return Users.all().then(function(data){
						return data;
					});
				}
			},
			controller: 'AllUsersCtrl'
		})
                .state('forgotpassword', {
			url: '/forgotpassword',
			templateUrl: '/admin/templates/forgotpassword.html',
			controller: 'forgotpasswordCtrl'
		})

		.state('addUser', {
			url: '/addUser',
			templateUrl: '/admin/templates/addUser.html',
			controller: 'addUserCtrl'   
		})
		.state('editUser', {
			url: '/editUser/:paraml',
			templateUrl: '/admin/templates/editUser.html',
			controller: 'editUserCtrl'
		})
                .state('profileUser', {
			url: '/profileUser/:paraml',
			templateUrl: '/admin/templates/profileUser.html',
			controller: 'dashboardCtrl'
		});
});

