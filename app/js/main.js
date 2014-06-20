'use strict';

// Add a substring function to String
if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

// Create the application.
var rcfApp = angular.module( 'rcfApp', [ 'ngRoute', 'restangular' ]);

// Configure our routes.
rcfApp.config( function( $routeProvider, $sceDelegateProvider ) {
	$routeProvider

	.when('/', {
		templateUrl : '/pages/apps.html',
		controller  : 'mainController'
	})
	
	.when('/new', {
		templateUrl : '/pages/upload.html',
		controller  : 'uploadController'
	})
	
	.when('/settings', {
		templateUrl : '/pages/settings.html',
		controller  : 'settingsController'
	})

	.when('/app/:appName', {
		templateUrl : '/pages/app.html',
		controller  : 'appController'
	})
	
	.otherwise({ redirectTo: '/' });
		
	// Required because the upload form targets another domain.
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',	// Allow same origin resource loads.
		'**']);
});

rcfApp.run( function( $rootScope ) {
	var obj = localStorage.getItem( 'rest-location' );
	if( obj )
		$rootScope.restUrl = angular.fromJson( obj );
	else
		$rootScope.restUrl = '';
});
