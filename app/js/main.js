// 'use strict';

// Create the application.
var rcfApp = angular.module( 'rcfApp', [ 'ngRoute', 'restangular' ]);
// var rcfUrl = 'http://localhost:9998/'; //'http://localhost:8080/roboconf-dm/rest/';

// Configure our routes.
rcfApp.config( function( $routeProvider, $sceDelegateProvider ) {
	$routeProvider

	.when('/', {
		templateUrl : 'pages/apps.html',
		controller  : 'mainController'
	})
	
	.when('/new', {
		templateUrl : 'pages/upload.html',
		controller  : 'uploadController'
	})
	
	.when('/settings', {
		templateUrl : 'pages/settings.html',
		controller  : 'settingsController'
	})

	.when('/app/:appName', {
		templateUrl : 'pages/app.html',
		controller  : 'appController'
	})
	
	.otherwise({ redirectTo: '/' });
		
	// Required because the upload form targets another domain.
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',	// Allow same origin resource loads.
		'**']);
});

rcfApp.run( function( $rootScope ) {
	var obj = localStorage.getItem( 'preferences' );
	if( obj != 'undefined' && obj != null )
		$rootScope.restUrl = angular.fromJson( obj ).dm.rest.location;
	else
		$rootScope.restUrl = '';
})

// Create the controller and inject Angular's $scope.
rcfApp.controller( 'mainController', function( $scope, $rootScope, $route, Restangular ) {
	$scope.rInvoked = false;
	$scope.rootUrl = $rootScope.restUrl;
	Restangular.setBaseUrl( $rootScope.restUrl );
		
	Restangular.all( 'applications' ).getList().then( function( applications ) {
		$scope.rInvoked = true;
		$scope.rErrorMsg = '';
		$scope.apps = applications;
		
	}, function() {
		$scope.rInvoked = true;
		$scope.rErrorMsg = 'Communication with the server failed.';
	})
	
	
	// Call-backs for ng-clicks    
    $scope.deleteApp = function( appName ) {
		Restangular.one( 'applications/' + appName ).remove();
		setTimeout(function () {
	        $scope.$apply(function () {
	        	$route.reload();
	        });
	    }, 2000);
    };
});

rcfApp.controller( 'uploadController', function( $scope, $rootScope ) {
	// FIXME: check whether the '/' must be added or not!
	$scope.actionUrl = $rootScope.restUrl + '/applications';
});

rcfApp.controller( 'settingsController', function( $scope, $rootScope, Restangular ) {
	$scope.preferences = '';
	$scope.message = '';
	
	Restangular.setBaseUrl( $rootScope.restUrl );
	$scope.restorePrefs = function() {
    	var obj = localStorage.getItem( 'preferences' );
    	if( obj != 'undefined' && obj != null )
    		$scope.preferences = angular.fromJson( obj );
    };
    
    $scope.checkDm = function() {
		Restangular.setBaseUrl( $rootScope.restUrl );
		Restangular.one( 'init' ).get().then( 
			function( result ) {
				$scope.dmState = result == "true" ? "Initialized" : "Not initialized";
			}, function() {
				$scope.dmState = 'Unknown';
		});
    }
    
    $scope.initializeDm = function( msgServerLoc ) {
		Restangular.setBaseUrl( $rootScope.restUrl );
		Restangular.one( 'init' ).post( '', msgServerLoc ).then( 
			function() {
				$scope.message = 'The deployment manager was (re)initialized.';
			}, function() {
				$scope.message = 'The deployment manager could not be (re)initialized.';
			}
		);
		
		setTimeout( function() {
			$scope.message = '';
			$scope.$apply();
		}, 4000 );	
    }
    
    $scope.savePrefs = function( prefs ) {
		$rootScope.restUrl = prefs.dm.rest.location;
		localStorage.setItem( 'preferences', angular.toJson( prefs ));
		$scope.preferences = angular.copy( prefs );
		
		this.checkDm();
    };
    
    $scope.restorePrefs();
    $scope.checkDm();
});

rcfApp.controller( 'appController', function( $scope, $rootScope, $route, $routeParams, Restangular ) {
	$scope.rInvoked = false;
	$scope.appName = $routeParams.appName;
	Restangular.setBaseUrl( $rootScope.restUrl );
	
	Restangular.all( 'app/' + $scope.appName + '/all-children' ).getList().then( function( instances ) {
		$scope.rInvoked = true;
		$scope.rErrorMsg = '';
		$scope.instances = instances;
		
	}, function() {
		$scope.rInvoked = true;
		$scope.rErrorMsg = 'Communication with the server failed.';
	})
	
	
	// Call-backs for ng-clicks
	$scope.perform = function( appName, actionName, instancePath ) {
		var escapedPath = instancePath.replace( new RegExp( '\\|', 'g' ), '%7C' );
		var noChild = angular.toJson( false );
		Restangular.one( 'app/' + appName + '/' + actionName + '/instance/' + escapedPath ).post( '', noChild );
		setTimeout(function () {
	        $scope.$apply(function () {
	        	$route.reload();
	        });
	    }, 2000);
    };
    
    $scope.findPosition = function( instancePath ) {
    	return instancePath.match(/\|/g).length;
    }
});
